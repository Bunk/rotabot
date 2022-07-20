import Joi from 'joi'

export default () => Joi.object().keys({
  PAGERDUTY_API_KEY: Joi.string().required()
})
