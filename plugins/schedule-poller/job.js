import _ from 'lodash'
import { Collections, getRepository } from '#app/data'
import { emitter } from '#app/events'
import { Events } from './events.js'

const hasChanged = (lhs, rhs) => {
  const mapComparison = (obj) => _.map(_.get(obj, 'users'), 'email')
  return !_.isEqual(mapComparison(lhs), mapComparison(rhs))
}

const generateKey = (schedule) => {
  const parts = Object.entries(schedule).reduce((acc, [key, value]) => {
    acc.push(`${key}:${value}`)
    return acc
  }, [])
  return parts.join(':')
}

export default {
  name: 'schedule-poller',
  description: 'Polls all configured schedules for updates',
  schedule: '0 * * * *', // Top of every hour
  runOnStart: true,

  async run (ctx) {
    const now = new Date()
    const configStorage = getRepository(Collections.CONFIGURATIONS)
    const internalStorage = getRepository(Collections.SCHEDULES, 'memory')

    const configs = await configStorage.fetch(ctx)

    for (const config of configs) {
      const emit = (...args) => emitter(config.id).emit(...args)
      const schedules = _.get(config, 'schedules', [])

      for (const [ref, schedule] of Object.entries(schedules)) {
        const key = generateKey(schedule)
        const externalStorage = getRepository(Collections.SCHEDULES, schedule.type)

        // Fetch stored schedule from previous run
        const stored = await internalStorage.fetch(ctx, { key })
        const current = await externalStorage.fetch(ctx, { ...schedule, date: now })
        const changed = hasChanged(stored, current)
        if (changed) {
          emit(ctx, Events.ScheduleChanged, {
            schedule: { ...schedule, ref },
            previous: stored,
            current
          })
          await internalStorage.store(ctx, key, current)
        }
      }
    }
  }
}
