const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { text, type } = req.query;

    if (text == "" || text == "all" || !text || !type) {
      return res.json({ success: false, data: [], message:"Send Type or Text" });
    }

    const types = (type === "all") 
    ? "stock,index,etf,mutualfund,smallcase,gold"
    : type;

    // Construct the URL with the dynamic types
    const url = `https://api.tickertape.in/search?text=${text}&types=${types}&pageNumber=0`;
    console.log(url);
    
    const response = await axios.get(url);
    const limitedData = response.data.data.stocks.slice(0, 10);

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
