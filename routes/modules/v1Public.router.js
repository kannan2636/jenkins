const authUserController = require('../../controllers/auth/auth.controller.js')
const authMiddlewareValidate = require('../../middlewares/validations/authValidation.js')
const   {
            userRegisterValidation,
            userLoginValidation,
            changePasswordValidation,
            resetPasswordValidation,
            resetPwdUpdateValidation,
            validate
        } = require('../../middlewares/validations/authValidation.js')

const router = require('express').Router()

// Common User API
router.post('/signup' , userRegisterValidation(), validate ,authUserController.userRegister)
router.post('/signin' , userLoginValidation(), validate , authUserController.userLogin)
router.post('/forgotpassword' , changePasswordValidation(), validate , authUserController.forgotPassword)
router.get('/resetpassword/:token' , resetPasswordValidation(), validate, authUserController.resetPassword)
router.post('/update/resetpassword' , resetPwdUpdateValidation(), validate, authUserController.resetPassword)
// Refresh Token
router.post('/refreshtoken', authMiddlewareValidate.refreshtoken(), authMiddlewareValidate.validate, authUserController.refreshToken)

module.exports = router