const notImplemented = (method) => { throw new Error(`not implemented: ${method}`) }

export async function repository ({ fetch, store } = {}) {
  return {
    fetch: fetch || (() => notImplemented('fetch')),
    store: store || (() => notImplemented('store'))
  }
}

export async function compose (...repos) {
  return {
    async fetch (ctx, opt = {}) {
      const retval = []
      for (const repo of repos) {
        const values = repo.fetch(ctx, opt)
        retval.push(...values)
      }
      return retval
    },

    async store () { notImplemented('store') }
  }
}
