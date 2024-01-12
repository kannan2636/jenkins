const jwt = require('jsonwebtoken');
const { header, body, param , validationResult } = require('express-validator');
const JWTvalidate = require('../middlewares/authVerifyJwtUid');
const db = require('../models');
const Users = db.users

require('dotenv').config();

const authTokenVerify = () => {
    return [
      header('Authorization')
      .notEmpty()
      .withMessage('Authorization header is required')
      .custom(async (value) => {
          // Perform header value validation logic here
          // You can access the value using `value` variable
          // Example validation: Check if the value starts with "Bearer "
          if (value && value.startsWith('Bearer ')) {
            // Assuming Bearer token format
            let validation = await JWTvalidate.validateJWT(value);
            if(validation == "TOKEN EXPIRED"){
              throw new Error('Access token has been Expired');
            }else if(validation == "DELETED ACCOUNT"){
              throw new Error('Your account has been deleted');
            }else if(validation == false){
              throw new Error('Unauthorized request / User logged out');
            }else{
              return true;
            }
          }else{
            throw new Error('Invalid Authorization header');
          }
      }),
    ]
  }
  
  const validate = (req, res, next) => {
    
    const extractedErrors = []
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    errors.array().map(err => extractedErrors.push({
      "Field" : err.path,
      "value": err.value,
      "message": err.msg
    }))
  
    return res.status(422).json({
      isSuccess: false,
      message: "Something Went Wrong!!",
      errors: extractedErrors,
    })
    
  }

module.exports = {
    authTokenVerify,
    validate
}



