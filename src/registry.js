export class NamedRegistry {
  constructor (registrations) {
    this.registrations = registrations || {}
  }

  get (name) {
    if (!name) throw new Error('name is required')
    if (!this.registrations[name]) throw new Error(`unknown registration: ${name}`)
    return this.registrations[name]
  }

  register (name, registration) {
    if (!name) throw new Error('invalid: name')
    if (!registration) throw new Error('invalid: registration')
    if (this.registrations[name]) throw new Error(`duplicate registration detected: ${name}`)
    this.registrations[name] = registration
  }
}

export default { NamedRegistry }
