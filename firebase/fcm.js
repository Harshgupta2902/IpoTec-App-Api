// // utils/sendNotification.js

// const { admin, db } = require("./firebase");

// const sendNotification = async (userData, messageTemplate) => {
//   const message = {
//     ...messageTemplate,
//     token: userData.token,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log(`Successfully sent message to ${userData.name || "user"}:`, response);
//     return response;
//   } catch (error) {
//     console.log(`Error sending message to ${userData.name || "user"}:`, error);
//     return null;
//   }
// };

// const sendNotificationsToUsers = async (messageTemplate) => {
//   const usersSnapshot = await db.collection("userData").get();
//   const usersWithTokens = [];

//   usersSnapshot.forEach((doc) => {
//     const userData = doc.data();
//     if (userData.token) {
//       usersWithTokens.push(userData);
//     }
//   });

//   if (usersWithTokens.length === 0) {
//     throw new Error("No users with tokens found.");
//   }

//   const promises = usersWithTokens.map(async (user) => {
//     return sendNotification(user, messageTemplate);
//   });

//   const results = await Promise.all(promises);
//   return results;
// };

// module.exports = { sendNotificationsToUsers };



const { admin } = require("./firebase");

const sendNotification = async (token, messageTemplate) => {
  const message = {
    ...messageTemplate,
    token: token,
  };
  console.log(messageTemplate);
  

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
