const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    // Prepare the payload
    const data = {
      exchangeAggReqMap: {
        NSE: {
          priceSymbolList: [],
          indexSymbolList: ["NIFTY", "BANKNIFTY", "FINNIFTY", "NIFTYMIDSELECT", "INDIAVIX", "NIFTYTOTALMCAP", "NIFTYJR", "NIFTY100"],
        },
        BSE: {
          priceSymbolList: [],
          indexSymbolList: ["1", "14"],
        },
      },
    };

    // Fetch data from the API
    const response = await axios.post(
      "https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated",
      data
    );

    // Extract and transform the data
    const transformedData = [];
    const { exchangeAggRespMap } = response.data;

    for (const [exchange, dataMap] of Object.entries(exchangeAggRespMap)) {
      const { indexLivePointsMap } = dataMap;
      if (indexLivePointsMap) {
        for (const [symbol, details] of Object.entries(indexLivePointsMap)) {
          transformedData.push({
            price: details.value, 
            symbol: details.symbol,
            dayChange: details.dayChange,
            dayChangePerc: details.dayChangePerc,
          });
        }
      }
    }

    // Send the transformed data as a response
    res.status(200).json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from Groww API",
      error: error.message,
    });
  }
});

module.exports = router;
