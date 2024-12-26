const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.json({
        success: false,
        data: [],
        message: "Send Type",
      });
    }

    // Construct the URL dynamically
    const url = `https://analyze.api.tickertape.in/homepage/stocks?universe=LargeCap&type=${type}&dataCount=5&offset=0`;

    const response = await axios.get(url);

    let limitedData = [];

    if (type === "gainers") {
      limitedData = response.data.data.gainers;
    } else if (type === "losers") {
      limitedData = response.data.data.losers;
    } else if (type === "active") {
      limitedData = response.data.data.active;
    } else if (type === "approachingHigh") {
      limitedData = response.data.data.approachingHigh;
    } else if (type === "approachingLow") {
      limitedData = response.data.data.approachingLow;
    } else {
      return res.json({
        success: false,
        data: [],
        message: "Invalid type",
      });
    }

    res.json({ success: true, data: limitedData, message: "Data Fetched" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from TickerTape",
    });
  }
});

module.exports = router;
