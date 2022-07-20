import _ from 'lodash'
import { composite, conditionalIf, conditionalFn, lookupAction } from './handlers.js'

export function createListener (config) {
  // event: <string> | { name: <string>, schedule-ref: <ref> }
  let event = {}
  if (_.isPlainObject(config.event)) { event = config.event }
  if (_.isString(config.event)) { event.name = config.event }
  if (!event.name) throw new Error('Expected an event name to listen for')

  // steps: <array>
  const steps = config.steps
  let eventHandler = composite(steps.map(step => lookupAction(step)))

  // if: <expr>
  const ifExpr = config.if
  if (ifExpr) {
    eventHandler = conditionalIf(ifExpr, eventHandler)
  }

  // event: { ...matchers }
  const matchers = _.omit(event, 'name')
  for (const [key, value] of Object.entries(matchers)) {
    const fn = ({ $event }) => _.get($event, key) === value
    eventHandler = conditionalFn(fn, eventHandler)
  }

  return {
    event: event.name,
    handler: eventHandler
  }
}
