import _ from 'lodash'
import yaml from './yaml/dal.js'
import memory from './memory/dal.js'

export const Collections = {
  CONFIGURATIONS: 'configurations',
  SCHEDULES: 'schedules'
}

// Note:  Plugins can map additional types to these collections
const repositories = {
  [Collections.CONFIGURATIONS]: { default: yaml, yaml },
  [Collections.SCHEDULES]: { default: memory, memory }
}

export function registerRepository ({ collection, types, repository }) {
  if (!collection) throw new Error('invalid: collection')
  if (!types || !_.isArray(types)) throw new Error('invalid: types')
  if (!repository) throw new Error('invalid: repository')

  const coll = repositories[collection]
  if (!coll) throw new Error(`unsupported collection: ${collection}`)

  for (const type of types) {
    if (coll[type]) throw new Error(`duplicate repository type detected: ${collection}/${type}`)
    coll[type] = repository
  }
}

export function getRepository (collection, type = 'default') {
  const coll = repositories[collection]
  if (!coll) throw new Error(`invalid collection: ${collection}`)

  const repo = coll[type]
  if (!repo) throw new Error(`invalid type: ${type}`)

  return repo
}

export async function fetch (ctx, collection, opt = {}) {
  const repo = getRepository(collection, opt.type)
  return repo.fetch(ctx, opt)
}

export async function store (ctx, collection, value, opt = {}) {
  const repo = getRepository(collection, opt.type)
  return repo.store(ctx, value, opt)
}

export default {
  getRepository,
  registerRepository,
  fetch,
  store
}
