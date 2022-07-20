import bolt from '@slack/bolt'

export async function connect (ctx) {
  const app = new bolt.App({
    token: ctx.config.SLACK_BOT_KEY,
    signingSecret: ctx.config.SLACK_SIGNING_SECRET
  })

  await app.start(ctx.config.PORT)
  ctx.log.info({ port: ctx.config.PORT }, '⚡️ Slack app is running')

  return app
}

export default { connect }
