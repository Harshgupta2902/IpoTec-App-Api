const express = require("express");
const router = express.Router();
const { admin } = require("./firebase");

// Define the message template
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

// Route to send notification to a single user by FCM token
router.post("/sendNotification", async (req, res) => {
    const { token } = req.query; // FCM token passed as a query parameter

  if (!token) {
    return res.status(400).json({ message: "FCM token is required." });
  }

  try {
    const message = {
      ...messageTemplate,
      token, // Send the notification to the provided token
    };

    // Send the notification via Firebase Cloud Messaging
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);

    // Respond with success
    res.json({
      message: "Notification sent successfully",
      response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: "Failed to send notification",
      error: error.message,
    });
  }
});

module.exports = router;
