const { admin } = require("./firebase");

const sendNotification = async (token, messageTemplate) => {
  const message = {
    ...messageTemplate,
    token: token,
  };
  try {
    const response = await admin.messaging().send(message);
    console.log(`Successfully sent message to`, response);
    return response;
  } catch (error) {
    console.log(`Error sending message to `, error);
    return null;
  }
};

module.exports = { sendNotification };
