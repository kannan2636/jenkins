var FCM = require('fcm-node');
const environment = process.env;
var fcm = new FCM(environment.FIREBASE_SERVER_KEY);

async function sendNotification(messageDetails) {
    debugger
    try {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: messageDetails.devicetoken,
            notification: {
                title: messageDetails.title,
                body: messageDetails
            },
            data: {  //you can send only notification or only data(or include both)
                details: messageDetails
            }
        };
        return await sendFCMNotification(message);
    }
    catch (ex) {
        return { isSuccess: false, message: "Invalid Value", data: ex };
    }
}

// Define an async function to send the FCM message
const sendFCMNotification = async (message) => {
    return new Promise((resolve, reject) => {
      fcm.send(message, function (err, response) {
        if (err) {
            console.log("Successfully sent with response: ", response);
            reject(false); // Reject the promise with the error
        } else {
            console.log("Successfully sent with response: ", response);
            resolve(true); // Resolve the promise with the response
        }
      });
    });
  };

module.exports = {
    sendnotification: sendNotification
}