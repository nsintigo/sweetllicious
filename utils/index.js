const Joi = require('joi')
const { now } = require('mongoose')

const isValidComment = comment => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        comment: Joi.string().min(20).max(250).required(),
        date: Joi.date().default(now)
    })

    const { error, value } = schema.validate(comment)
    return { error, value}
}

const validateCommentPatch = comment => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).req,
        comment: Joi.string().min(20).max(250),
        date: Joi.date(now)
    })

    const { error, value } = schema.validate(comment)
    return { error, value }
}

module.exports = {
    isValidComment,
    validateCommentPatch
}