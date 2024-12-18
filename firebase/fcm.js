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
    if (
      error.errorInfo?.code === "messaging/registration-token-not-registered"
    ) {
      console.log(`invalid token: ${token}`);
    }

    return null;
  }
};

const sendNotificationToTopic = async (messageTemplate) => {
  const message = {
    ...messageTemplate,
    topic: "notification",
  };
  try {
    const response = await admin.messaging().send(message);
    console.log(`Successfully sent message to`, response);
    return response;
  } catch (error) {
    if (
      error.errorInfo?.code === "messaging/registration-token-not-registered"
    ) {
      console.log(`invalid token: ${token}`);
    }

    return null;
  }
};

module.exports = { sendNotification, sendNotificationToTopic };
