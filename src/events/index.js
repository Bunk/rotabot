import data, { Collections } from '#app/data'
import { createListener } from './config.js'
import { dispose, emit, emitter, register } from './emitter.js'

/**
 * Registers event listeners for the given process configuration.
 * @param {*} config Configuration settings
 */
export function registerConfiguration (rootConfig) {
  const listenerConfigs = rootConfig.on || []
  for (const listenerConfig of listenerConfigs) {
    const listener = createListener(listenerConfig)
    register({
      id: rootConfig.id,
      listener
    })
  }
}

export async function listen (ctx) {
  const configs = await data.fetch(ctx, Collections.CONFIGURATIONS)
  for (const conf of configs) {
    registerConfiguration(conf)
  }
}

export { dispose, emit, emitter, register }
export default { listen, dispose, registerConfiguration }
