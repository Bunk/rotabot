import cron from 'node-cron'
import { ulid } from 'ulid'
import { emit } from '#app/events'
import { Events } from './events.js'

const scheduled = {}

export async function run (ctx0, name, job) {
  const log = ctx0.log.child({ job_id: ulid(), job_name: name })
  const ctx = { ...ctx0, log }

  try {
    emit(ctx, Events.JobRun, { ...job })

    const run = job.run ? job.run.bind(job) : () => {}
    await Promise.resolve(run(ctx))

    emit(ctx, Events.JobDone, { ...job })
  } catch (err) {
    log.error({ err }, 'Error running job')
    emit(ctx, Events.JobError, { err, ...job })
  }
}

export function schedule (ctx, name, job) {
  if (isScheduled(name)) {
    ctx.log.warn(
      { name },
      'Another cron task has already been scheduled with the same name.  ' +
      'Skipping scheduling.'
    )
    return
  }

  const task = cron.schedule(job.schedule, () => run(ctx, name, job))
  scheduled[name] = task
}

export function isScheduled (name) {
  return scheduled[name]
}

export default { run, isScheduled, schedule }
