const otpGenerator = require('otp-generator');

module.exports.generateOTP = () => {
  debugger
  const OTP = otpGenerator.generate(4, { 
    upperCaseAlphabets: false, 
    specialChars: false, 
    lowerCaseAlphabets: false, 
    expires:'3m' 
  });

  // To add minutes to the current time 5
  const expiration_time = new Date(new Date().getTime() + 3 * 60000);
  return {OTP, expiration_time};

};