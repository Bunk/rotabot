import _ from 'lodash'
import { NamedRegistry } from '#app/registry'

const registry = new NamedRegistry()

export function registerAction (name, factory) {
  if (!_.isFunction(factory)) throw new Error('invalid: factory')
  return registry.register(name, factory)
}

export function getAction (name) {
  return registry.get(name)
}

export default { getAction, registerAction }
