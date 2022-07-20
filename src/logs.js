import _ from 'lodash'
import bunyan from 'bunyan'

const isProtected = (key) => {
  return /token|key|secret|username|password/i.test(key)
}

const obfuscateString = (value) => {
  // return new Array(value.length + 1).join('*')
  return '******************************'
}

const obfuscateObject = (obj) => {
  return _.transform(obj, (result, val, key) => {
    if (_.isString(val) && isProtected(key)) {
      result[key] = obfuscateString(val)
    } else if (_.isPlainObject(val)) {
      result[key] = obfuscateObject(val)
    } else if (_.isArray(val)) {
      result[key] = _.map(val, obfuscateObject)
    } else {
      result[key] = val
    }
  }, {})
}

let _defaultLevel
export function defaultLevel (level) {
  _defaultLevel = level
}

export function create ({ name = 'rotabot' } = {}) {
  return bunyan.createLogger({
    name,
    level: _defaultLevel,
    serializers: {
      ...bunyan.stdSerializers,
      cfg (config) {
        try {
          return obfuscateObject(config)
        } catch (err) {
          return null
        }
      },
      context (context) {
        return obfuscateObject(_.omit(context, ['log', 'data']))
      }
    }
  })
}

export default { defaultLevel, create }
