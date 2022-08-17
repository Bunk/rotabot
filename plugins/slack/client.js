import bolt from '@slack/bolt'

export async function connect (ctx) {
  const app = new bolt.App({
    token: ctx.config.SLACK_BOT_TOKEN,
    signingSecret: ctx.config.SLACK_SIGNING_SECRET
  })

  await app.start(ctx.config.PORT)
  ctx.log.info({ port: ctx.config.PORT }, '⚡️ Slack app is running')

  return app
}

function ensureContext (ctx) {
  if (!ctx.slack) {
    ctx.slack = { users: {} }
  }
  return ctx
}

export async function updateGroup (ctx, groupId, slackIds = []) {
  if (!groupId) throw new Error("expected 'groupId'")

  const slack = ctx.clients.slack.client
  await slack.usergroups.users.update({
    usergroup: groupId,
    users: slackIds.join(',')
  })
}

export async function lookupUser (ctx, email) {
  ctx = ensureContext(ctx)

  const slack = ctx.clients.slack.client

  let found = ctx.slack.users[email]
  if (!found) {
    try {
      const res = await slack.users.lookupByEmail({ email })
      found = res.user
      ctx.slack.users[email] = found
    } catch (err) {
      ctx.log.error({ email, err }, 'unable to lookup user by email')
      return null
    }
  }

  return found
}

export default { connect, updateGroup, lookupUser }
