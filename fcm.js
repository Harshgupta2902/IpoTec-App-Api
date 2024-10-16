const express = require("express");
const router = express.Router();
const { admin, db } = require("./firebase");
const { messaging } = require("firebase-admin");

router.get("/", async (req, res) => {
  const usersSnapshot = await db.collection("userData").get();

  const usersWithTokens = [];
  usersSnapshot.forEach((doc) => {
    const userData = doc.data();

    if (userData.token) {
      usersWithTokens.push(userData);
    }
  });

  if (usersWithTokens.length === 0) {
    return res.status(404).json({ message: "No users with tokens found." });
  }

  const messageTemplate = {
    notification: {
      title: "📢 Waaree Energies Limited IPO",
      body: `
🗓️ Date: 21 - 23 Oct, 2024
🏷️ Price Band: ₹1427 - ₹1503
📦 Market Lot: 9 Shares
💰 Application Amount: ₹13,527
📏 IPO Size: ₹4,321.44 Cr Approx
👦 Retail Portion: 35%
📃 Retail Form: 11,01,319 forms
📄 HNI Small Form: 10,489 forms
📄 HNI Big Form: 20,978 forms
🏷️ Face Value: ₹10 per share
      `,
    },
    data: {
      key1: "value1",
      key2: "value2",
    },
  };

  try {
    const promises = usersWithTokens.map(async (user) => {
      const message = {
        ...messageTemplate,
        token: user.token,
      };

      try {
        const response = await admin.messaging().send(message);
        console.log(
          `Successfully sent message to ${user.name || "user"}:`,
          response
        );
        return response;
      } catch (error) {
        console.log(`Error sending message to ${user.name || "user"}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);

    // Respond with the results
    res.json({
      message: "Notifications sent successfully",
      results,
    });

    console.log("Successfully sent message:");
  } catch (error) {
    console.log("Error sending message:", error);
  }
});

module.exports = router;
