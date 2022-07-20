import v2 from './v2.js'

export function adapt (obj, version) {
  switch (version) {
    case 2: return v2.adapt(obj)
  }
}

export default { adapt }
