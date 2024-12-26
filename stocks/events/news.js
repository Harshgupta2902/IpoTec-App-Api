const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { offset = 1 } = req.query;
    const newOffset = (offset - 1) * 10;
    const url = `https://analyze.api.tickertape.in/v2/homepage/events?count=10&offset=${newOffset}`;
    const response = await axios.get(url);
    const filteredData = response.data.data.all.filter(item => 
      item.type === "news" || item.type === "corpActions"
    );

    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch data from TickerTape",
      });
  }
});

module.exports = router;
