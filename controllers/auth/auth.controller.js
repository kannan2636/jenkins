const configDatabase = require('../../config/databaseConfig.js');
const responsHelper = require('../../lib/responseHelper');
const db = require('../../models').default;
const pwd = require('../../lib/password');
const { generateOTP } = require('../../lib/otp')
const Email = require('../../middlewares/email');
const jwt = require('../../lib/jwToken');
const jsonWebToken = require('jsonwebtoken');
const GlobalAuthValidate = require('../../middlewares/authVerifyJwtUid');
const refreshJwt = require('jsonwebtoken');

const Users = db.users

const userRegister = async (req , res) => {
    debugger
    try {
            // HASH PASSWORD
            var generatePwd = pwd.hashUserPassword(req.body.password);
            req.body.salt = generatePwd.salt;
            req.body.password = generatePwd.hash;
            req.body.status = true;
            req.body.isDelete = false;
            
            const users = await Users.create(req.body).then(async result => {
                if(result){
                    // Welcom Email
                    // var emailData = {    
                    //     otp: "123456",
                    //     email: req.body.email,
                    //     template_type: 'Forget_OTP' heightUnit
                    // }
                    // await Email.emailtouser(emailData);
                    result.jsonWebToken = jwt.generateUserToken({email:result.email, userId : result.id}, 15 * 24 * 60 * 60);
                    result.refreshToken = jwt.generateUserToken({email:result.email, userId : result.id}, 30 * 24 * 60 * 60);
                    result.isLoggedIn = true;
                    if(result.save()){
                        result.password = undefined; result.salt = undefined; result.otp = undefined; result.expiration_time = undefined;
                        return responsHelper.SendResponse(res, { isSuccess: true, message: "User Registration Successful!!", data: result });
                    }else{
                        return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
                    }
                    
                }else{
                    return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!"});
                }
            }).catch(err => {
                console.log(err);
                return responsHelper.SendErrorResponse(err, res);
            });
                 
    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

const userLogin = async (req , res) => {
    debugger
    try {
        
        const user = await Users.findOne({ where: { email: req.body.email, status: 1 } });

        if (user) {
            let isPwdHashMatch = pwd.validateUserPassword(req.body.password, user.password, user.salt);
            if(!isPwdHashMatch){
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Invalid User Password!!" });
            }else if(user.isDelete == 1){
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Account has been deleted!!" });
            }
            // let token = jwt.generateUserToken({email:user.email, userId : user.id}, 3 * 24 * 60 * 60); user.jsonWebToken = token; user.isLoggedIn = true;
            user.jsonWebToken = jwt.generateUserToken({email:user.email, userId : user.id}, 15 * 24 * 60 * 60); user.isLoggedIn = true;
            user.refreshToken = jwt.generateUserToken({email:user.email, userId : user.id}, 30 * 24 * 60 * 60);
            if(user.save()){
                user.password = undefined; user.salt = undefined; user.otp = undefined; user.expiration_time = undefined;
                return responsHelper.SendResponse(res, { isSuccess: true, message: "User Login Successful!!" , data : user});
            }else{
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
            }
        }else{
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Invalid User Email!!" });
        }
    }catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

const userProfile = async (req , res) => {
    debugger
    try {
        const {uid} = req.params;
        let token = req.header('Authorization');
        let userAuth = await GlobalAuthValidate.matchLiveUser(token,uid);
        if(!userAuth){
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Tocken user ID and Request user ID mismatch Or Token Expired!!" });
        }
        const user = await Users.findOne({ where: { id: uid, status: 1 , isLoggedIn: 1} });
        if (user) {
            user.password = undefined; user.salt = undefined; user.jsonWebToken = undefined;
            user.otp = undefined; user.expiration_time = undefined;
            return responsHelper.SendResponse(res, { isSuccess: true, message: "Get Profile Details Successful!!" , data : user});
        }else{
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
        }
    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

const signout = async (req , res) => {
    debugger
    try {
        let token = req.header('Authorization');
        let userAuth = await GlobalAuthValidate.matchLiveUser(token,req.body.id);
        if(!userAuth){
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Tocken user ID and Request user ID mismatch Or Token Expired!!" });
        }
        const user = await Users.findOne({ where: { email: req.body.email, id: req.body.id } });
        if (user) {

            user.isLoggedIn = false;
            user.jsonWebToken = null;
            user.refreshToken = null;
            user.deviceToken = null;

            if(user.save()){
                return responsHelper.SendResponse(res, { isSuccess: true, message: "Logout Successful!!" });
            }else{
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
            }
        }else{
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
        }
    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}


const deleteUser = async (req , res) => {
    debugger
    try {
        let token = req.header('Authorization');
        let userAuth = await GlobalAuthValidate.matchLiveUser(token,req.body.id);
        if(!userAuth){
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Tocken user ID and Request user ID mismatch Or Token Expired!!" });
        }
        const user = await Users.findOne({ where: { email: req.body.email, id: req.body.id } });
        if (user) {

            user.status = false;
            user.isDelete = true;

            if(user.save()){
                return responsHelper.SendResponse(res, { isSuccess: true, message: "Your account deleted Successful!!" });
            }else{
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
            }
        }else{
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
        }
    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

// FORGET PASSWORD OTP
const forgotPassword = async (req , res) => {
    debugger
    try {
        // Get User by Email
        const checkUser = await Users.findOne({ where: { email: req.body.email } });
        //OTP Generator
        const newOtp = generateOTP();
        console.log(newOtp)
        // Upadate User
        checkUser.otp = newOtp.OTP;
        // Token Generator ExpTime 3 Min
        let tokenValue = jwt.generateUserToken({email:checkUser.email, otp : newOtp.OTP}, 5 * 60);
        if(checkUser.save())
        {
            
            var emailData = {
                token : req.protocol+"://"+configDatabase.RUN_hostname+":"+configDatabase.RUN_port+"/api/v1/user/resetpassword/"+tokenValue,
                user : checkUser,
                template_type: 'Forget_OTP'
            }
            await Email.emailtouser(emailData);
            return responsHelper.SendResponse(res, { isSuccess: true, message: "Password Reset Email Send Successfully!!", data: { expiration_time : newOtp.expiration_time} });

        }else{

            return responsHelper.SendResponse(res, { isSuccess: false, message: "Failed to updated OTP." });

        }

    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

// RESET PASSWORD 
const resetPassword = async (req , res) => {
    debugger
    try {
        let  token;
        if (req.method === 'GET') {
            // Handle GET request
            token = req.params.token;
          } else if (req.method === 'POST') {
            // Handle POST request
            token = req.body.token;
          } else {
            // Handle other request types
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!"});
          }
        let userData = {};
        let validate = await jsonWebToken.verify(token, process.env.JWT_SECERT_KEY, async function (err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                  return false;
                }
                return false;
            }else{
                if(decoded.otp && decoded.email){
                    const findUser = await Users.findOne({ where: { otp: decoded.otp, email: decoded.email, status: 1 } }).then(result => {
                        if (result) {
                            userData.token = token;
                            if(req.method === 'POST' && req.body.password != ''){
                                var generatePwd = pwd.hashUserPassword(req.body.password);
                                result.salt = generatePwd.salt;
                                result.password = generatePwd.hash;
                                return result.save() ? true : false;
                            }else if(req.method === 'POST'){
                                return false;
                            }
                            return true;
                        }else{
                            return false;
                        }
                      });
                    return findUser;
                }else{
                    return false;
                }
            }
        });
        if(validate && req.method === 'GET'){
            res.render('resetpassword', { isSuccess: true, userData : userData });
        }else if(validate && req.method === 'POST'){
            return responsHelper.SendResponse(res, { isSuccess: true, message: "Password Updated Successful!!"});
        }else{
            return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!"});
        }

    }
    catch (ex) {
        console.log("Error",ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
    
}

// REFRESH TOKEN
const refreshToken = async (req , res) => {
    debugger
    try {
        return refreshJwt.verify(req.body.token, process.env.JWT_SECERT_KEY, async function (err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return responsHelper.SendResponse(res, { isSuccess: false, message: "Token Expired" });
                }
                return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
            } else {
                if (decoded.userId && decoded.email && decoded.userId == req.body.userId) {
                    return await Users.findOne({ 
                        where: {
                            id: decoded.userId, 
                            email: decoded.email, 
                            refreshToken: req.body.token
                        } }).then(result => {
                        if (result && result.isDelete == 1) {
                            return responsHelper.SendResponse(res, { isSuccess: false, message: "User Account has been Deleted!!" });
                        }else if(result){
                            result.jsonWebToken = jwt.generateUserToken({email:result.email, userId : result.id}, 15 * 24 * 60 * 60);
                            if(result.save()){
                                return responsHelper.SendResponse(res, { isSuccess: true, message: "Get Access Token Successful!!" , data : {"accessToken": result.jsonWebToken}});
                            }else{
                                return responsHelper.SendResponse(res, { isSuccess: false, message: "Something Went Wrong!!" });
                            }
                        }else{
                            return responsHelper.SendResponse(res, { isSuccess: false, message: "Invalid Authorization!!" });
                        }
                      });
                } else {
                    return responsHelper.SendResponse(res, { isSuccess: false, message: "Tocken user ID and Request user ID mismatch Or Token Expired!!" });
                }
            }
        });
    }
    catch (ex) {
        console.log(ex);
        return responsHelper.SendErrorResponse(ex, res);
    }
}

module.exports = {
    userRegister, 
    userLogin,
    signout,
    forgotPassword,
    resetPassword,
    deleteUser,
    refreshToken,
    userProfile
}