const jwt = require('jsonwebtoken');
const { header, body, param , validationResult } = require('express-validator');
const db = require('../models').default;
const Users = db.users

require('dotenv').config();

const matchliveuser = async (value,uid) => {
    try {
        // Assuming Bearer token format
        let token = value.split(' ')[1];
        let validate = await jwt.verify(token, process.env.JWT_SECERT_KEY, async function (err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                  return false;
                }
                return false;
            }else{
                console.log(decoded.userId,"----",uid);
                if(decoded.userId && decoded.email && decoded.userId == uid){
                    const findUser = await Users.findOne({ where: { id: decoded.userId, email: decoded.email, jsonWebToken: token, isLoggedIn: 1, status: 1 } }).then(result => {
                        if (result) {
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
        return validate; 
    } catch (error) {
        console.log("Error:", error);
        return false;        
    }
}

const validateJwt = async (value) => {
    try {
    // Assuming Bearer token format
    let token = value.split(' ')[1];
    let validate = await jwt.verify(token, process.env.JWT_SECERT_KEY, async function (err, decoded) {
        if (err) {
            console.log("TokenExpired",err);
          if (err.name === "TokenExpiredError") {
            console.log("TokenExpired");
            return "TOKEN EXPIRED";
          }
          return false;
        } else {
                if(decoded.userId && decoded.email){
                const findUser = await Users.findOne({ where: { id: decoded.userId, email: decoded.email, isLoggedIn: 1, status: 1 } }).then(result => {
                    if (result.isDelete == 1){
                        return "DELETED ACCOUNT";
                    }else if(result) {
                        return result;
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
        return validate;
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

module.exports = {
    matchLiveUser : matchliveuser,
    validateJWT : validateJwt
}


