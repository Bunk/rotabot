import _ from 'lodash'
import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'
import versions from './versions/index.js'

const relativeTo = (dir) => (files) => _.map(files, fileName => path.resolve(dir, fileName))
const filterYaml = (files) => _.filter(files, file => file.endsWith('.yml') || file.endsWith('.yaml'))
const yamlFiles = async (dir) => relativeTo(dir)(filterYaml(await fs.readdir(dir)))

const _read = async (ctx, path) => {
  const { log } = ctx

  try {
    const src = await fs.readFile(path, { encoding: 'utf8' })

    const config = yaml.parse(src)
    const version = config.version || 1

    const doc = versions.adapt(config, version)

    doc.id = `file:\\${path}`

    return doc
  } catch (err) {
    log.warn({ err, path }, 'Error reading configuration file')
    return null
  }
}

const _readAll = async (ctx) => {
  const { log } = ctx
  const paths = await yamlFiles('./data/configs')

  const configs = []
  for (const path of paths) {
    const config = await read(ctx, path)
    if (config) {
      log.debug({ path }, 'Loaded configuration')
      configs.push(config)
    }
  }

  return configs
}

export const read = _.memoize(_read, (_, path) => path)
export const readAll = _.once(_readAll)

export default { read, readAll }
