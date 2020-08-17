const { body, validationResult } = require('express-validator')
const db=require("../models");
const Club=db.Club;
const userValidationRules = () => {
  return [
    
    body('ownerId').optional().isInt({min:1,max:2}),
    body('name').exists().notEmpty().isString()
    
  ]
}


const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).send({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate
}
