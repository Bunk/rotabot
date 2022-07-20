import EventEmitter from 'eventemitter2'

const subscribe = (emitter, key, handler) => {
  emitter.on(key, handler)
  return () => emitter.off(key, handler)
}

const GLOBAL_EMITTER = 'global'

const registrations = {}
export async function register (opt) {
  if (!opt.id) throw new Error('id is required')
  if (!opt.listener) throw new Error('listener is required')
  if (!opt.listener.handler) throw new Error('listener.handler is required')

  let registration = registrations[opt.id]
  if (!registration) {
    const emitter = new EventEmitter({ wildcard: true })
    const listeners = []
    registration = { emitter, listeners }
    registrations[opt.id] = registration
  }

  const eventName = opt.listener.event || '*'
  const eventHandler = opt.listener.handler
  const listener = subscribe(registration.emitter, eventName, eventHandler)
  registration.listeners.push(listener)
}

export async function dispose () {
  // Remove all of the event subscriptions
  for (const reg of registrations) {
    for (const dispose of reg.listeners) {
      dispose()
    }
  }
}

const nullEmitter = { emitter: { emit: () => {} } }
export function emitter (id) {
  const reg = registrations[id] || nullEmitter
  const emit = (ctx, key, ...args) => {
    ctx.log.info(`Emit: '${key}'`)
    reg.emitter.emit(key, ctx, ...args)
  }
  return { emit }
}

export function emit (ctx, key, ...args) {
  return emitter(GLOBAL_EMITTER).emit(ctx, key, ...args)
}

export default { dispose, emit, emitter, register }
