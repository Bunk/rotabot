import scheduleChanged from './schedule-changed.js'

export function install (installer) {
  installer.registerTemplate('slack/channel/schedule-changed', scheduleChanged)
}

export default { install }
