const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.json({
        success: false,
        data: [],
        message: "Send Type",
      });
    }

    let data = {};

    if (type === "large") {
      data = {"match":{"option":["Growth"],"subsector":["Large Cap Fund"]},"sortOrder":-1,"project":["subsector","option","amcCode","ret1y"],"offset":0,"count":5,"mfIds":[],"sortBy":"ret1y"};
    } else if (type === "mid") {
      data = {"match":{"option":["Growth"],"subsector":["Mid Cap Fund"]},"sortOrder":-1,"project":["subsector","option","amcCode","ret1y"],"offset":0,"count":5,"mfIds":[],"sortBy":"ret1y"};
    } else if (type === "small") {
      data = {"match":{"option":["Growth"],"subsector":["Small Cap Fund"]},"sortOrder":-1,"project":["subsector","option","amcCode","ret1y"],"offset":0,"count":5,"mfIds":[],"sortBy":"ret1y"};
    } else if (type === "elss") {
      data = {"match":{"option":["Growth"],"subsector":["Equity Linked Savings Scheme (ELSS)"]},"sortOrder":-1,"project":["subsector","option","amcCode","ret1y"],"offset":0,"count":5,"mfIds":[],"sortBy":"ret1y"};
    } else if (type === "index") {
      data = {"match":{"option":["Growth"],"subsector":["Index Fund"]},"sortOrder":-1,"project":["subsector","option","amcCode","ret1y"],"offset":0,"count":5,"mfIds":[],"sortBy":"ret1y"};
    } else if(type === "etf"){
      data = {"match":{"subindustry":["E_G","E_Q","E_D"]},"sortOrder":-1,"project":["subindustry","mrktCapf","lastPrice","apef","52wpct"],"offset":0,"count":5,"sids":[],"sortBy":"52wpct"};
    }


    const url = type === "etf" ? "https://api.tickertape.in/screener/query" : "https://api.tickertape.in/mf-screener/query";

    const response = await axios.post(url, data);


    res.json({ success: true, data: type === "etf"? response.data.data.results: response.data.data.result, message: "Data Fetched" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from TickerTape",
    });
  }
});

module.exports = router;
