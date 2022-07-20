import { Events } from './events.js'
import config from './config.js'
import job from './job.js'

export function install (ctx, installer) {
  ctx.log.info('Loading plugin: schedule-poller@1.0.0')

  installer.registerJob({ job })
  installer.registerConfig('schedule-poller', config)
}

export { Events }
export default { install, Events }
