const { body, validationResult } = require('express-validator')
const userValidationRulesCreate= () => {
  return [
    body('name').isString(),
    body('name').exists(),
    body('ownerId').optional(),
    body('ownerId').isDecimal({min:1,max:2})
  ]
}
const userValidationRulesUpdate =()=>{
    return[
        body('id').isDecimal(),
        body('id').exists(),
        body('name').isString(),
        body('name').exists(),
        body('ownerId').optional(),
        body('ownerId').isDecimal({min:1,max:2})
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
  userValidationRulesCreate,
  userValidationRulesUpdate,
  validate,
}
