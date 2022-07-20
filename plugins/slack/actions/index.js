import updateGroup from './update-group.js'
import sendMessage from './send-message.js'

export function install (installer) {
  installer.registerAction('slack/update-group', updateGroup)
  installer.registerAction('slack/send-message', sendMessage)
}

export default { install }
