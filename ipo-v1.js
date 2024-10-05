const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://groww.in/v1/api/stocks_primary_market_data/v2/ipo/all"
    );

    const data = response.data.ipoCompanyListingOrderMap;

    // Merge ACTIVE and UPCOMING
    const mergedActiveUpcoming = [...data.ACTIVE, ...data.UPCOMING];

    // Format all keys for ACTIVE and UPCOMING
    const formattedMerged = mergedActiveUpcoming.map((item) => {
      return Object.keys(item).reduce((formattedItem, key) => {
        const value = item[key];
        formattedItem[key] = typeof value === "boolean" ? value : String(value);
        return formattedItem;
      }, {});
    });

    // Format the LISTED section separately
    const formattedListed = data.LISTED.map((item) => {
      return Object.keys(item).reduce((formattedItem, key) => {
        const value = item[key];
        formattedItem[key] = typeof value === "boolean" ? value : String(value);
        return formattedItem;
      }, {});
    });

    res.json({
      active: formattedMerged,
      listed: formattedListed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
