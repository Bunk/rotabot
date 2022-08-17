import Joi from 'joi'

export default () => Joi.object().keys({
  SLACK_CLIENT_ID: Joi.string().required(),
  SLACK_CLIENT_SECRET: Joi.string().required(),
  SLACK_SIGNING_SECRET: Joi.string().required(),
  SLACK_BOT_TOKEN: Joi.string().required()
})
