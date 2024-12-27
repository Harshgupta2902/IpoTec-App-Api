const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const router = express.Router();
const moment = require("moment-timezone"); // Import moment.js for time calculations

router.get("/", async (req, res) => {
  try {
    const { offset = 1 } = req.query;
    const response = await axios.get(
      `https://www.moneycontrol.com/news/business/ipo/page-${offset}/`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = [];
    const watermark = "moneycontrol";
    const logoImage =
      "https://play-lh.googleusercontent.com/qTe9gNn4oQ_TRLtVqWBr_CeqXqcSMniRo1kZOUKLcK0huJ6V3qL6ibEOnK6Xls1k4Rg=w480-h960-rw";

    $("#cagetory li")
      .not(".hide-mobile, .show-mobile")
      .each((i, elem) => {
        const title = $(elem).find("h2 a").text();
        const link = $(elem).find("a").attr("href");
        let image = $(elem).find("img").attr("data");

        if (image) {
          image = image.split("?")[0];
        }

        // Extract the commented span text
        const comment = $(elem)
          .html()
          .match(/<!--\s*<span>(.*?)<\/span>\s*-->/);
        const rawDate = comment ? comment[1].trim() : null;

        let formattedDate = null;
        if (rawDate) {
          const dateParts = rawDate.match(
            /(\w+) (\d+), (\d{4}) (\d{2}):(\d{2}) ([APM]+) IST/
          );
          if (dateParts) {
            const [, month, day, year, hours, minutes, ampm] = dateParts;

            // Convert to ISO 8601 format for Moment.js
            const formattedDate = moment.tz(
              `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`,
              "MMMM DD, YYYY hh:mm A",
              "Asia/Kolkata"
            );

            // Calculate relative time
            const now = moment();
            const diffMinutes = now.diff(formattedDate, "minutes");
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = now.diff(formattedDate, "days");

            if (diffMinutes < 60) {
              relativeDate = `${diffMinutes}m`; // e.g., "5m", "59m"
            } else if (diffHours < 24) {
              relativeDate = `${diffHours}h`; // e.g., "1h", "23h"
            } else {
              relativeDate = `${diffDays}d`; // e.g., "1d", "2d"
            }
          }
        }

        // Skip if title is empty
        if (title) {
          articles.push({
            title,
            link,
            image,
            date: relativeDate,
            watermark,
            logo: logoImage,
          });
        }
      });

    res.json({ articles }); // Sending only the extracted data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
