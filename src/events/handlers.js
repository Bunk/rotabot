import lodash from 'lodash'
import actions from '#app/actions'
import { expr } from '#app/utils'

export function lookupAction (step) {
  const factory = actions.getAction(step.uses)
  const action = factory(step)
  return safeAction(step.uses, action)
}

export function safeAction (key, handler) {
  return (ctx, event) => {
    const onError = (err) => ctx.log.error({ err }, `Unable to run: ${key}`)
    try {
      // Registered step handlers may return promises or not, so
      // both catch errors and handle the promise failures.
      const maybePromise = handler(ctx, event)
      Promise.resolve(maybePromise).catch(onError)
    } catch (err) {
      onError(err)
    }
  }
}

export const composite = (handlers = []) => {
  return (ctx, event) => {
    for (const handler of handlers) {
      handler(ctx, event)
    }
  }
}

export const conditionalFn = (fn, handler) => {
  return (ctx, event) => {
    if (!fn) return handler(ctx, event)

    try {
      const truthy = !!fn({
        $: lodash,
        $event: event
      })
      if (truthy) return handler(ctx, event)
    } catch (err) {
      ctx.log.error({ err }, 'Error in conditional')
    }
  }
}

export const conditionalIf = (cond, handler) => {
  const fn = expr.compile(cond)
  return conditionalFn(fn, handler)
}

export default { lookupAction, composite, conditionalFn, conditionalIf }
