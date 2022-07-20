import Joi from 'joi'

export default () => Joi.object().keys({
  HOURLY_SCHEDULE: Joi.string().default('0 * * * *'),
  WEEKLY_SCHEDULE: Joi.string().default('0 7 * * 1')
})
