require('dotenv').config();

async function EmailToUser(collectValue) {
    debugger
    try {
        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        let tempType = '';
        switch (collectValue.template_type) {
            case "Welcom_Email":
                tempType = process.env.WELCOM_EMAIL_TEMP
                break;
            case "Register_OTP":
                tempType = process.env.WELCOM_EMAIL_TEMP
                break;
            case "Forget_OTP":
                tempType = process.env.FORGET_OTP_TEMP
            break;
        }
        
        const msg = {
            to: collectValue.user.email,
            from: process.env.SMTP_FROM_EMAIL_ID,
            template_id: tempType,
            dynamic_template_data: {token : collectValue.token, userdata : collectValue.user.dataValues}
        };

        // ES6
        // sgMail.send(msg)
        //     .then((response) => {
        //         console.log(response[0].statusCode)
        //         console.log(response[0].headers)
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     });

        // ES8
        (async () => {
            try {

                let emailRes = await sgMail.send(msg);
                console.log(emailRes[0].statusCode)
                console.log(emailRes[0].headers)

            } catch (error) {

                console.error(error);
                if(error.response) {
                    console.error(error.response.body)
                }

            }
          })();

    } catch (error) {
        return {
            code: 'SERVER_ERROR12',
            description: error
        };
    }
}

module.exports = {
    emailtouser: EmailToUser
}