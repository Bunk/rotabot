import { registerAction } from '#app/actions'
import { registerClient } from '#app/clients'
import { registerConfig } from '#app/config'
import { registerRepository } from '#app/data'
import { registerJob } from '#app/jobs'
import { registerTemplate } from '#app/templates'

export default {
  registerAction,
  registerClient,
  registerConfig,
  registerJob,
  registerRepository,
  registerTemplate
}
