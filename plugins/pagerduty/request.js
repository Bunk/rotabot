import { http } from '#app/utils'

export default (ctx) => http(ctx).extend({
  prefixUrl: 'https://api.pagerduty.com',
  headers: {
    Accept: 'application/vnd.pagerduty+json;version=2',
    Authorization: `Token token=${ctx.config.PAGERDUTY_API_KEY}`
  },
  responseType: 'json'
})
