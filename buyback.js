const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://groww.in/v1/api/stocks_portfolio/v2/buyback/fetch/all"
    );
    res.json(response.data.data.buyBackDetailsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
