const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.moneycontrol.com/news/business/ipo/"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = [];

    $("#cagetory li")
      .not(".hide-mobile, .show-mobile")
      .each((i, elem) => {
        const title = $(elem).find("h2 a").text();
        const link = $(elem).find("a").attr("href");
        const image = $(elem).find("img").attr("data");
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
            // Manually constructing the date in "14 Oct, 24 02:06 PM" format
            const [, month, day, year, hours, minutes, ampm] = dateParts;
            const shortYear = year.slice(2);
            const shortMonth = new Date(`${month} 1`).toLocaleString("en-us", {
              month: "short",
            });
            formattedDate = `${day} ${shortMonth},${shortYear} ${hours}:${minutes} ${ampm}`;
          }
        }

        // Skip if title is empty
        if (title) {
          articles.push({ title, link, image, date: formattedDate });
        }
      });

    res.json({articles}); // Sending only the extracted data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
