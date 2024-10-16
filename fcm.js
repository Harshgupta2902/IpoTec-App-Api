const express = require("express");
const router = express.Router();
const { admin } = require("./firebase");

router.get("/", async (req, res) => {
  const deviceToken =
    "fiJzkhRnQ8Gz3QPks--sVX:APA91bG57p2eiVX4_IiWdztsZJgyPlsS57E48bx8sZd1w60zjG9qQ3jFhf3U3EFeVgX7VCjoLtz94PXKClq85rC8VvNk4_UaReBhYCb1wRLGBHv9Dh9f3dxzlLDjS6cqEY812Ij9abgF";

  const message = {
    token: deviceToken,
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
    const response = await admin.messaging().send(message);
    res.json({ response });
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.log("Error sending message:", error);
  }
});

module.exports = router;
