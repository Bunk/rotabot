import _ from 'lodash'

const documents = {}

export function fetchAll (ctx, { prefix = '' } = {}) {
  const docs = _.filter(documents, (value, key) => _.startsWith(key, prefix))
  ctx.log.debug({ prefix, docs }, 'memory:fetchAll')
  return docs
}

export function fetch (ctx, { key, prefix } = {}) {
  if (key) { return documents[key] }
  return fetchAll(ctx, { prefix })
}

export function store (ctx, key, value) {
  documents[key] = value
}

export default { fetch, store }
