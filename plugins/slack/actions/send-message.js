import templates from '#app/templates'

export default function factory (opt) {
  // TODO: Support 'channel-name' to lookup channel id's more easily.
  //       https://api.slack.com/methods/admin.conversations.search
  const channel = opt['channel-id']
  const template = templates.getTemplate(opt.template)

  return (ctx, event) => {
    ctx.log.trace({ ...opt, ...event }, 'action: slack/send-message')

    ctx.clients.slack.client.chat.postMessage({
      channel,
      ...template(event)
    })
  }
}
