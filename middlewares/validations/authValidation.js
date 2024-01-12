const { body, param, validationResult } = require('express-validator')
const db = require('../../models').default
const pwd = require('../../lib/password')
const Users = db.users


const userRegisterValidation = () => {
  return [
    body('firstName')
      .notEmpty()
      .withMessage('The first name field is required and cannot be empty.')
      .isString()
      .withMessage('The first name field value must be a string.'),
    
    body('lastName')
      .notEmpty()
      .withMessage('The last name field is required and cannot be empty.')
      .isString()
      .withMessage('The last name field value must be a string.'),

    body('email')
      .notEmpty()
      .withMessage('The email field is required and cannot be empty.')
      .isEmail()
      .withMessage('Invalid Email Formate')
      .custom(async (value) => {
        if (value) {
          let query = { where: { email: value } };
          let emailStatus = await checkEmail(query);
          if (value && emailStatus) {
            // Will use the below as the error message
            throw new Error('A user already exists with this e-mail address');
          }
        } else {
          throw new Error('A user already exists with this e-mail address');
        }
      }),

    body('password')
      .notEmpty()
      .withMessage('The password field is required and cannot be empty.')
      .isLength({ min: 8 })
      .withMessage('Password minimum length is 8')
      .isString()
      .withMessage('The password field value must be a String.'),

    body('phoneNumber')
      .notEmpty()
      .withMessage('The password field is required and cannot be empty.')
      .isNumeric()
      .withMessage('The password field value must be a Numeric.')
      .isLength({ min: 10 })
      .withMessage('Phone Number minimum length is 10'),
      // .custom(async (value) => {
      //   if (value) {
      //     let query = { where: { phoneNumber : value } };
      //     let emailStatus = await checkEmail(query);
      //     if (value && emailStatus) {
      //       // Will use the below as the error message
      //       throw new Error('A user already exists with this Phone Number');
      //     }
      //   } else {
      //     throw new Error('A user already exists with this Phone Number');
      //   }
      // }),

    body('gender')
      .notEmpty()
      .withMessage('The gender field is required and cannot be empty.')
      .isString()
      .withMessage('The gender field value must be a String.'),

    body('yob')
      .notEmpty()
      .withMessage('The yob field is required and cannot be empty.')
      .isInt().withMessage('YOB must be an integer')
      .toInt().withMessage('YOB must be an integer')
      .isInt({ min: 1930, max: new Date().getFullYear() }) // Validate that the year is within a certain range
      .withMessage('Year must be between 1930 and the current year'),

    body('deviceToken')
      .notEmpty()
      .withMessage('The device token field is required and cannot be empty.')
      .isString()
      .withMessage('The device token field value must be a String.'),

    body('country')
      .notEmpty()
      .withMessage('The country field is required and cannot be empty.')
      .isString()
      .withMessage('The country field value must be a String.'),

    body('countryCode')
      .notEmpty()
      .withMessage('The country code field is required and cannot be empty.')
      .isString()
      .withMessage('The country code field value must be a String.'),
      
    body('weight')
      .notEmpty()
      .withMessage('The weight field is required and cannot be empty.')
      .custom(value => {
        if (typeof value !== 'number' || value % 1 !== 0) {
          throw new Error('Weight must be an integer (String & Decimals NOT allowed).');
        }
        return true;
      })
      .isInt()
      .withMessage('Weight must be an integer.'),

    body('weightUnit')
      .notEmpty()
      .withMessage('The weight unit field is required and cannot be empty.')
      .isString()
      .withMessage('The weight unit field value must be a String.'),

    body('heightFeet')
      .notEmpty()
      .withMessage('The height field is required and cannot be empty.')
      .isNumeric().withMessage('Feet must be an integer')
      .toInt().withMessage('Feet must be an integer')
      .isInt({ max: 9 , min : 1 })
      .withMessage('Feet must be between 1 to 9'),
    
    body('heightInch')
      .notEmpty()
      .withMessage('Height Inch field is required and cannot be empty.')
      .custom(value => {
        if (typeof value !== 'number' || value % 1 !== 0) {
          throw new Error('Height Inch must be an integer (String & Decimals NOT allowed).');
        }
        return true;
      })
      .isInt({ min: 0, max: 11 })
      .withMessage('Inches must be between 0 and 11'),
  ];
};

const userLoginValidation = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('The email field is required and cannot be empty.')
      .isEmail()
      .withMessage('Invalid Email Format'),
    
    body('password')
      .notEmpty()
      .withMessage('The password field is required and cannot be empty.')
      .isString()
      .withMessage('The password field value must be a String.') 
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')   
  ]
};

const changePasswordValidation = () => {
  return [
    // username must be an email
    body('email').isEmail().withMessage('Invalid Email').custom(async value => {
      if(value){
        let query = { where: { email: value } };
        const getUserDetails = await checkEmail(query);
        if(getUserDetails.isDelete == 1){
            //Will use the below as the error message
            throw new Error('Your Account has been deleted!!');           
        }else if(!getUserDetails){
          //Will use the below as the error message
          throw new Error('Email doesn\'t exist..!');           
        }
      }
    })
  ]
}

const userLogoutValidation = () => {
  return [
    // username must be an email
    body('email').isEmail().withMessage('Invalid Email Formate').custom(async value => {
      if(value){
        let query = { where: { email: value } };
        const getUserDetails = await checkEmail(query);
        if(!getUserDetails){
            //Will use the below as the error message
            throw new Error('Email doesn\'t exist..!');           
        }
      }
    }),
    body('id').notEmpty().withMessage('The ID field is required and cannot be empty.').isAlphanumeric().withMessage('ID must be alphanumeric'),
  ]
}

const resetPasswordValidation = () => {
  return [
    // Token Format validation
    param('token')
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid JWT format')
    .isLength({ min: 60 })
    .withMessage('Token must be at least 60 characters')
  ]
}

const refreshtoken = () => {
  return [
    // Token Format validation
    body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid JWT format')
    .isLength({ min: 60 })
    .withMessage('Token must be at least 60 characters'),
    
    body('userId')
      .notEmpty()
      .isInt()
      .withMessage('User Profile ID must be a valid integer'),
  ]
}

const resetPwdUpdateValidation = () => {
  return [
    // Token Format validation
    body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid JWT format')
    .isLength({ min: 60 })
    .withMessage('Token must be at least 60 characters'),

    body('password')
      .notEmpty()
      .withMessage('The password field is required and cannot be empty.')
      .isLength({ min: 6 })
      .withMessage('Password minimum length is 6')
      .isString()
      .withMessage('This password field value must be a String.')
  ]
}

// Global Email Check
const checkEmail = async (query) => {
  return await Users.findOne(query);
}

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  
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
    userRegisterValidation,
    userLoginValidation,
    changePasswordValidation,
    userLogoutValidation,
    resetPasswordValidation,
    resetPwdUpdateValidation,
    checkEmail,
    refreshtoken,
    validate,
}