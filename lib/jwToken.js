const jwt = require('jsonwebtoken');
require('dotenv').config();

function GenerateUserToken(value,expTime){
    try{
        const token = jwt.sign(value, 
            process.env.JWT_SECERT_KEY, 
            {expiresIn: expTime});
        return token;
    }catch(ex){
        console.log(ex);
        return "";
    }   
}

module.exports = {
    generateUserToken : GenerateUserToken
}



