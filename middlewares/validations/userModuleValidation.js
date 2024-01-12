const { body, param, query, validationResult, check } = require('express-validator')
const emailValidate = require('../validations/authValidation')

const profileUpdateValidation = () => {
    return [
      body('profileId')
        .notEmpty()
        .isInt()
        .withMessage('User Profile ID must be a valid integer'),
      
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
      
      body('phoneNumber')
        .notEmpty()
        .withMessage('The phone number field is required and cannot be empty.')
        .isNumeric()
        .withMessage('This field value must be a Numeric.')
        .isLength({ min: 10 })
        .withMessage('Phone Number minimum length is 10'),
  
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
      
      body('country')
        .notEmpty()
        .withMessage('The country field is required and cannot be empty.')
        .isString()
        .withMessage('The country field value must be a String.'),
  
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
        .withMessage('Inches must be between 0 and 11')
    ];
  };

  
const userDeleteValidation = () => {
    return [
      // username must be an email
      body('email').isEmail().withMessage('Invalid Email').custom(async value => {
        if(value){
          let query = { where: { email: value } };
          const getUserDetails = await emailValidate.checkEmail(query);
          if(!getUserDetails){
              //Will use the below as the error message
              throw new Error('Email doesn\'t exist..!');           
          }
        }
      }),
      body('id').notEmpty().withMessage('The ID field is required and cannot be empty.').isAlphanumeric().withMessage('ID must be alphanumeric'),
    ]
}

const validateDeviceToken = () => {
  return [
    body('userId')
      .notEmpty()
      .isInt()
      .withMessage('User Profile ID must be a valid integer'),
    body('deviceToken')
      .notEmpty()
      .withMessage('The device token field is required and cannot be empty.')
      .isString()
      .withMessage('The device token field value must be a string.'),
  ];
};

const userIDValidation = () => {
    return [ 
        param('uid')
        .notEmpty()
        .isInt()
        .withMessage('User ID must be a valid integer.')
    ];
};

const changePwdValidation = () => {
  return [ 
      body('uid')
        .notEmpty()
        .isInt()
        .withMessage('User ID must be a valid integer'),

      body('oldPassword')
        .notEmpty()
        .withMessage('The old password field is required and cannot be empty.')
        .isLength({ min: 6 })
        .withMessage('Old password minimum length is 6')
        .isString()
        .withMessage('The old password field value must be a String.'),
  
      body('newPassword')
        .notEmpty()
        .withMessage('The new password field is required and cannot be empty.')
        .isLength({ min: 6 })
        .withMessage('New password minimum length is 6')
        .isString()
        .withMessage('The new password field value must be a String.'),
  
      body('confirmPassword')
        .notEmpty()
        .withMessage('The confirm password field is required and cannot be empty.')
        .isLength({ min: 6 })
        .withMessage('confirm password minimum length is 6')
        .isString()
        .withMessage('The confirm password field value must be a String.')
  ];
};

const validateFeedback = () => {
  return [
    body('userId')
      .notEmpty()
      .isInt()
      .withMessage('User Profile ID must be a valid integer'),
    body('feedbackType')
      .notEmpty()
      .withMessage('The Feedback Type is required and cannot be empty.')
      .isString()
      .withMessage('The Feedback Type value must be a string.'),
    body('feedbackMessage')
      .notEmpty()
      .withMessage('The Feedback Message is required and cannot be empty.')
      .isString()
      .withMessage('The Feedback Message value must be a string.'),
  ];
};

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
    userIDValidation,
    profileUpdateValidation,
    changePwdValidation,
    userDeleteValidation,
    validateDeviceToken,
    validateFeedback,
    validate,
}