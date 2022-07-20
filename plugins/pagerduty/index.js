import config from './config.js'
import schedules from './schedules.js'

export function install (ctx, installer) {
  ctx.log.info('Loading plugin: pagerduty@1.0.0')
  installer.registerRepository({
    collection: 'schedules',
    types: ['pagerduty'],
    repository: {
      fetch: schedules.fetch
    }
  })
  installer.registerConfig('pagerduty', config)
}

export default { install }
