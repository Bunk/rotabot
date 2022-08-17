import client from '../client.js'

export default async function channelScheduleChanged (ctx, event) {
  const schedule = event.current

  const messageParts = []
  for (let i = 0; i < schedule.users.length; i++) {
    const user = schedule.users[i]
    const slackUser = await client.lookupUser(ctx, user.email)

    const formattedUser = slackUser ? `<@${slackUser.id}>` : user.name
    messageParts.push(i === 0 ? `*${formattedUser}*` : `→ _${formattedUser}_`)

    if (i < schedule.users.length - 1) {
      messageParts.push(`\n → ⏲ (${user.delay}m)`)
    }
  }

  const endEpochTime = new Date(schedule.end).getTime() / 1000
  const message = messageParts.join(' ')

  return {
    text: 'The ... schedule has cycled to the next rotation',
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
