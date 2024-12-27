const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment-timezone"); // Import moment.js for time calculations

router.get("/", async (req, res) => {
  try {
    const { offset = 1 } = req.query;
    const newOffset = (offset - 1) * 10;
    const url = `https://analyze.api.tickertape.in/v2/homepage/events?count=10&offset=${newOffset}`;
    const response = await axios.get(url);
    const filteredData = response.data.data.all
      .filter(item => item.type === "news")
      .map(item => {

        let relativeDate = '';
        const formattedDate = moment.tz(item.data.date, "Asia/Kolkata");
        const now = moment();
        const diffMinutes = now.diff(formattedDate, "minutes");
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = now.diff(formattedDate, "days");

        if (diffMinutes < 60) {
          relativeDate = `${diffMinutes} MINUTES AGO`;
        } else if (diffHours < 24) {
          relativeDate = `${diffHours} HOUR AGO`;
        } else if (diffDays < 30) {
          relativeDate = `${diffDays} DAYS AGO`;
        } else if (diffDays >= 30 && diffDays < 365) {
          const diffMonths = Math.floor(diffDays / 30);
          relativeDate = `${diffMonths} MONTHS AGO`;
        } else {
          const diffYears = Math.floor(diffDays / 365);
          relativeDate = `${diffYears} YEAR AGO`;
        }
        

        return {
          type: "news",
          title: item.data.headline,
          desc: item.data.summary,
          date: relativeDate,
          imageUrl: item.data.imageUrl,
          link: item.data.link,
          publisher: item.data.publisher,
          sid: item.data.stocks[0].sid,
          initialPrice: item.data.stocks[0].initialPrice,
          price: item.data.stocks[0].price,
          close: item.data.stocks[0].close,
          slug: item.data.stocks[0].slug,
          ticker: item.data.stocks[0].ticker,
          tag: item.data.tag,
        };
      });

    res.json({ success: true, data: filteredData });
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
