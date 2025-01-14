const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const url = 'https://api.tickertape.in/mmi/now';
    const response = await axios.get(url);

    res.json({ success: true, data: response.data.data, message: "Data Fetched" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from TickerTape",
    });
  }
});

module.exports = router;
