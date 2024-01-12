const crypto = require('crypto');

function HashUserPassword(password){

    try{
        let salt = crypto.randomBytes(16).toString('hex');
        let hash = crypto.pbkdf2Sync(password, salt,1000, 64, `sha512`).toString(`hex`);        
        return {salt : salt, hash : hash, password :password };
    }
    catch(ex){
        return '';
    }
}

function ValidateUserPassword(pwd, pwdhash, salt){

    try{
        
        let hash = crypto.pbkdf2Sync(pwd.toString(), salt, 1000, 64, `sha512`).toString(`hex`);
        
        return hash === pwdhash ? true : false;
        
    }
    catch(ex){
        console.log(ex)
        return false;
    }
}

module.exports = {
    hashUserPassword : HashUserPassword,
    validateUserPassword : ValidateUserPassword
}