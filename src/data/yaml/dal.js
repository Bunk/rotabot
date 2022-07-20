import { readAll } from './yaml.js'

export function fetch (ctx) {
  return readAll(ctx)
}

export function store () {
  throw new Error('not implemented')
}

export default { fetch, store }
