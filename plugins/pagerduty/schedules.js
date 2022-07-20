import _ from 'lodash'
import qs from 'query-string'
import mapper from 'object-mapper'
import request from './request.js'

const Fields = {
  ESCALATION_POLICY: 'escalation-policy-id',
  SCHEDULE: 'schedule-id'
}

export async function fetch (ctx, opt) {
  const pagerduty = request(ctx)

  const buildQuery = (config) => {
    if (config[Fields.ESCALATION_POLICY]) return { escalation_policy_ids: [config[Fields.ESCALATION_POLICY]] }
    if (config[Fields.SCHEDULE]) return { schedule_ids: [config[Fields.SCHEDULE]] }
    return {}
  }

  const date = opt.date || new Date()
  const query = buildQuery(opt)
  const res = await pagerduty('oncalls', {
    searchParams: qs.stringify({
      ...query,
      include: ['users', 'escalation_policies'],
      time_zone: 'UTC',
      since: date.toISOString(),
      until: date.toISOString()
    }, { arrayFormat: 'bracket' })
  }).json()

  const oncalls = _.orderBy(res.oncalls, 'escalation_level')
  const result = mapper(oncalls, {
    '[0].escalation_policy.id': 'pagerduty.id',
    '[0].escalation_policy.summary': 'pagerduty.summary',
    '[0].escalation_policy.html_url': 'pagerduty.href',
    '[0].escalation_policy.type': 'pagerduty.type',
    '[0].escalation_policy.escalation_rules[].escalation_delay_in_minutes': 'users[].delay',
    '[].user.name': 'users[].name',
    '[].user.email': 'users[].email',
    '[].user.id': 'users[].pagerduty.id',
    '[].user.html_url': 'users[].pagerduty.href'
  })

  if (result.users && result.users.length) {
    const startDates = _.compact(_.map(oncalls, o => o.start && new Date(o.start)))
    const endDates = _.compact(_.map(oncalls, o => o.end && new Date(o.end)))
    result.start = new Date(Math.min(...startDates))
    result.end = new Date(Math.min(...endDates))
  }

  return result
}

export default { fetch }
