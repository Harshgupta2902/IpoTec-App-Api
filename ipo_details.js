const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:name", async (req, res) => {
  const { name } = req.params;

  const url = `https://groww.in/v1/api/stocks_primary_market_data/v1/ipo/company/${name}?isHniEnabled=true`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
