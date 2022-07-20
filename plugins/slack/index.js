import client from './client.js'
import config from './config.js'
import actions from './actions/index.js'
import templates from './templates/index.js'

export function install (ctx, installer) {
  ctx.log.info('Loading plugin: slack@1.0.0')

  installer.registerConfig('slack', config)
  installer.registerClient('slack', client.connect)

  actions.install(installer)
  templates.install(installer)
}

export default { install }
