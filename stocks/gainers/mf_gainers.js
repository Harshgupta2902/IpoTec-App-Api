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
      data = {
        match: { option: ["Growth"], subsector: ["Large Cap Fund"] },
        sortOrder: -1,
        project: ["subsector", "option", "amcCode", "ret1y"],
        offset: 0,
        count: 5,
        mfIds: [],
        sortBy: "ret1y",
      };
    } else if (type === "mid") {
      data = {
        match: { option: ["Growth"], subsector: ["Mid Cap Fund"] },
        sortOrder: -1,
        project: ["subsector", "option", "amcCode", "ret1y"],
        offset: 0,
        count: 5,
        mfIds: [],
        sortBy: "ret1y",
      };
    } else if (type === "small") {
      data = {
        match: { option: ["Growth"], subsector: ["Small Cap Fund"] },
        sortOrder: -1,
        project: ["subsector", "option", "amcCode", "ret1y"],
        offset: 0,
        count: 5,
        mfIds: [],
        sortBy: "ret1y",
      };
    } else if (type === "elss") {
      data = {
        match: {
          option: ["Growth"],
          subsector: ["Equity Linked Savings Scheme (ELSS)"],
        },
        sortOrder: -1,
        project: ["subsector", "option", "amcCode", "ret1y"],
        offset: 0,
        count: 5,
        mfIds: [],
        sortBy: "ret1y",
      };
    } else if (type === "index") {
      data = {
        match: { option: ["Growth"], subsector: ["Index Fund"] },
        sortOrder: -1,
        project: ["subsector", "option", "amcCode", "ret1y"],
        offset: 0,
        count: 5,
        mfIds: [],
        sortBy: "ret1y",
      };
    } else if (type === "etf") {
      data = {
        match: { subindustry: ["E_G", "E_Q", "E_D"] },
        sortOrder: -1,
        project: ["subindustry", "mrktCapf", "lastPrice", "apef", "52wpct"],
        offset: 0,
        count: 5,
        sids: [],
        sortBy: "52wpct",
      };
    }

    const url =
      type === "etf"
        ? "https://api.tickertape.in/screener/query"
        : "https://api.tickertape.in/mf-screener/query";

    const response = await axios.post(url, data);

    let transformedData;

    if (type === "etf") {    
      const sidString = response.data.data.results.map(item => item.sid).join(",");
      const url = `https://api.tickertape.in/stocks/infolite/?sids=${sidString}`;
      const etfResponse = await axios.get(url);
      transformedData = etfResponse.data.data.map((item) => {
        const matchedItem = response.data.data.results.find((resItem) => resItem.sid === item.sid);
        return {
          sid: item.sid,
          isin: item.isin,
          name: item.info.name,
          sector: item.info.sector,
          ticker: item.info.ticker,
          amcCode: item.info.amcCode,
          slug: item.slug,
          "52wpct": matchedItem?.stock?.advancedRatios?.["52wpct"] || null, // Extract `52wpct` if available
        };
      });
    
    } else {
      transformedData = response.data.data.result.map((item) => {
        const keyValueMap = item.values.reduce((acc, val) => {
          acc[val.filter] = val.strVal || val.doubleVal || null;
          return acc;
        }, {});

        return {
          ...item,
          ...keyValueMap,
          values: undefined, // Remove the original `values` field
        };
      });
    }

    res.json({ success: true, data: transformedData, message: "Data Fetched" });
    // res.json({ success: true, data: type === "etf"? response.data.data.results: response.data.data.result, message: "Data Fetched" });
  } catch (error) {
    // console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from TickerTape",
    });
  }
});

module.exports = router;
