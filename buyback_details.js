const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:name", async (req, res) => {
  const { name } = req.params;

  const url = `https://groww.in/v1/api/stocks_portfolio/v2/buyback/fetch?searchId=${name}`;
  try {
    const response = await axios.get(url);
    const mainData = response.data;

    const searchId = mainData.data.searchId?.replace("-buyback", "").trim();

    const reponse1 = await axios.get(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${searchId}?page=0&size=10`
    );
    const symnolData = reponse1.data;

    const reponse2 = await axios.get(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${searchId}?page=0&size=10`
    );
    const nav = reponse1.data;

    res.json({ mainData, symnolData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
