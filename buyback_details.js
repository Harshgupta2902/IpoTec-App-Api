const express = require("express");
const axios = require("axios");
const router = express.Router();

function convertShareHoldingPattern(shareHoldingPattern) {
  return Object.keys(shareHoldingPattern).map((period) => ({
    period: period,
    ...shareHoldingPattern[period],
  }));
}
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

  const url = `https://groww.in/v1/api/stocks_portfolio/v2/buyback/fetch?searchId=${name}`;
  try {
    const response = await axios.get(url);
    const mainData = response.data;
    const data = mainData.data;
    const searchId = mainData.data.searchId?.replace("-buyback", "").trim();

    const reponse1 = await axios.get(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${searchId}?page=0&size=10`
    );
    const symbolData = reponse1.data;

    const shareHoldingPattern = convertShareHoldingPattern(
      symbolData.shareHoldingPattern
    );
    delete symbolData.shareHoldingPattern;

    const financials = convertToNewFormat(symbolData.financialStatement);

    delete symbolData.financialStatement;
    delete symbolData.brandDtos;
    delete symbolData.fundsInvested;

    res.json({ data, symbolData, shareHoldingPattern, financials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// Convert the financials data
