const express = require("express");
const axios = require("axios");
const router = express.Router();

function convertToNewFormat(financials) {
  return financials.map((item) => {
    const yearlyArray = Object.keys(item.yearly).map((year) => ({
      year: parseInt(year),
      value: item.yearly[year],
    }));

    return {
      title: item.title,
      yearly: yearlyArray,
    };
  });
}

router.get("/:name", async (req, res) => {
  const { name } = req.params;

  const url = `https://groww.in/v1/api/stocks_primary_market_data/v1/ipo/company/${name}?isHniEnabled=true`;
  try {
    const response = await axios.get(url);

    const data = response.data;
    const financials = convertToNewFormat(data.financials);

    delete data.financials;

    res.json({ data, financials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
