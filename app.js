import clients from '#app/clients'
import config from '#app/config'
import events from '#app/events'
import installer from '#app/installer'
import jobs from '#app/jobs'
import logs from '#app/logs'

import pagerduty from '#plugins/pagerduty'
import poller from '#plugins/schedule-poller'
import slack from '#plugins/slack'

logs.defaultLevel(process.env.LOG_LEVEL)
const log = logs.create({ name: 'rotabot' })

const run = async () => {
  const ctx = { log }

  // Register internal plugins
  await pagerduty.install(ctx, installer)
  await poller.install(ctx, installer)
  await slack.install(ctx, installer)

  // Build all configuration values from registered plugins
  ctx.config = await config.build(process.env)
  if (ctx.config.errors) throw ctx.config.errors

  ctx.clients = await clients.build(ctx)

  await events.listen(ctx)
  await jobs.start(ctx)
  // - Run Slack bot
}

run().catch(err => log.error({ err }))
