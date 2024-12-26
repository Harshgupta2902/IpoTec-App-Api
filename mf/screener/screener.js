const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { offset = 1 } = req.query;
    const newOffset = (offset - 1) * 20;
    const url = "https://api.tickertape.in/mf-screener/query";
    const data = {
      match: {},
      sortBy: "aum",
      sortOrder: -1,
      project: ["subsector", "option", "aum", "ret3y", "expRatio"],
      offset: newOffset,
      count: 20,
      mfIds: [],
    };

    const response = await axios.post(url, data);

    res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch data from TickerTape",
      });
  }
});

module.exports = router;
