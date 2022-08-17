import Joi from 'joi'

export default () => Joi.object().keys({
  PAGERDUTY_API_TOKEN: Joi.string().required()
})
