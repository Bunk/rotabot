import lodash from 'lodash'
import { expr } from '#app/utils'
import client from '../client.js'

export default function factory (opt) {
  const groupId = opt['group-id']
  const select = expr.compile(opt.select)

  return async (ctx, event) => {
    const { log } = ctx
    log.trace({ opt, event }, 'action: slack/update-group')

    // Apply any restrictions to the list of scheduled users
    let selected = select({ $: lodash, $event: event })
    if (!lodash.isArray(selected)) selected = [selected]

    // Remove duplicate user emails
    selected = lodash.uniqBy(selected, 'email')
    log.trace({ selected }, 'selected group members')

    // Find the appropriate slack ids
    const users = []
    for (const user of selected) {
      const found = await client.lookupUser(ctx, user.email)
      if (found) { users.push(found) }
    }
    log.trace({ users }, 'selected slack users')

    try {
      const emails = lodash.map(users, 'profile.email')
      const ids = lodash.map(users, 'id')

      log.info({ 'group-id': groupId, emails, ids }, 'updated slack group')
      await client.updateGroup(ctx, groupId, ids)
    } catch (err) {
      log.error({ 'group-id': groupId, err }, 'unable to update group')
    }
  }
}
