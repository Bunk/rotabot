import { NamedRegistry } from '#app/registry'

const registry = new NamedRegistry()
const clients = {}

export function registerClient (name, factory) {
  registry.register(name, factory)
}

export async function build (ctx) {
  for (const [name, factory] of Object.entries(registry.registrations)) {
    clients[name] = await factory(ctx)
  }
  return clients
}

export function getClient (name) {
  if (!name) throw new Error('name is required')
  if (!clients[name]) throw new Error(`client not registered: ${name}`)
  return clients[name]
}

export default { build, getClient, registerClient }
