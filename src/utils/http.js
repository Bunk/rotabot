import got from 'got'
import util from 'node:util'
import { URL } from 'node:url'

const http = (ctx) => got.extend({
  handlers: [
    async (options, next) => {
      const method = options.method
      const parsedUrl = new URL(options.url)
      const url = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`

      const log = ctx.log.child({ method, url })
      const message = util.format('  --> %s %s', method, url)
      const start = Date.now()
      try {
        const response = await next(options)

        const statusCode = response.statusCode
        const duration = Date.now() - start
        log.info({ method, url, duration, statusCode }, message)

        return response
      } catch (err) {
        const { statusCode } = err.response
        const duration = Date.now() - start

        log.error({ method, url, duration, statusCode }, message)

        throw err
      }
    }
  ]
})

export default http
