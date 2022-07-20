const channelScheduleChanged = (event) => {
  const schedule = event.current

  const messageParts = schedule.users.reduce((acc, curr, idx) => {
    // User name
    const user = curr.slack ? `<@${curr.slack}>` : curr.name
    acc.push(idx === 0 ? `*${user}*` : `→ _${user}_`)

    // Don't append the last delay
    if (idx < schedule.users.length - 1) {
      acc.push(`\n → ⏲ (${curr.delay}m)`)
    }

    return acc
  }, [])

  const endEpochTime = new Date(schedule.end).getTime() / 1000
  const message = messageParts.join(' ')

  return {
    attachments: [{
      color: '#ff3366',
      blocks: [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `📟 ${message}`
        },
        accessory: {
          type: 'image',
          image_url: 'https://store.servicenow.com/12663466db48938092edfb771d9619ec.iix',
          alt_text: 'PagerDuty'
        }
      }, {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `<!date^${endEpochTime}^Until {date_long_pretty}|${new Date(endEpochTime)}>`
        }]
      }]
    }]
  }
}

export function install (installer) {
  installer.registerTemplate('slack/channel/schedule-changed', channelScheduleChanged)
}

export default { install }
