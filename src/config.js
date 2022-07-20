import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

let config = {}
const factories = {
  rotabot: () => Joi.object().keys({
    PORT: Joi.number().default(80),
    LOG_LEVEL: Joi.string()
      .allow('trace', 'debug', 'info', 'warn', 'error', 'fatal')
      .default('info'),
    ENVIRONMENT: Joi.string().default('production'),
    JIRA_HOST: Joi.string().required(),
    JIRA_USERNAME: Joi.string().required(),
    JIRA_PASSWORD: Joi.string().required(),
    STORAGE_TYPE: Joi.string().default('memory')
  })
}

export function process (name, env) {
  const schema = factories[name](env)
  return schema.validate(env, { abortEarly: false, stripUnknown: true })
}

export async function build (env = process.env) {
  for (const name of Object.keys(factories)) {
    const { value, error } = process(name, env)
    if (error) throw error

    config = Object.assign(config, value)
  }

  return config
}

export function registerConfig (name, factory) {
  if (!name) throw new Error('name is required')
  if (!factory) throw new Error('factory is required')
  if (factories[name]) throw new Error(`duplicate factory configuration detected: ${name}`)
  factories[name] = factory
}

export default { build, process, registerConfig }
