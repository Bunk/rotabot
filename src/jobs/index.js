import cron from './cron.js'

export { Events } from './events.js'

const jobs = {}

export function registerJob ({ job }) {
  if (!job) throw new Error('invalid: job')
  if (!job.name) throw new Error('invalid: job.name')
  if (!job.run) throw new Error('invalid: job.run')
  jobs[job.name] = job
}

export async function start (ctx, { names } = {}) {
  names = names || Object.keys(jobs)

  for (const name of names) {
    if (cron.isScheduled(name)) return

    const job = jobs[name]
    if (job.schedule) {
      cron.schedule(ctx, name, job)
    }

    if (job.runOnStart || !job.schedule) {
      cron.run(ctx, name, job)
    }
  }
}

export default { registerJob, start }
