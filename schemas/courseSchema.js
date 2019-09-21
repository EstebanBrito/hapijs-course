const Joi = require('@hapi/joi')

module.exports = {
  create: {
    name: Joi.string().min(1).max(100).required(),
    credits: Joi.number().integer().min(1).strict().required(),
    code: Joi.string().min(2).max(5).required(),
    description: Joi.string()
  }
}