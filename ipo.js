const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://groww.in/v1/api/stocks_primary_market_data/v2/ipo/all"
    );
    res.json(response.data.ipoCompanyListingOrderMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
