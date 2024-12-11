const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const { data: html } = await axios.get(
      "https://www.chittorgarh.com/calendar/ipo-calendar/1/"
    );

    const $ = cheerio.load(html);
    const calendarEvents = [];
    $("td.tr_box, td.tr_today").each((index, element) => {
      const day = $(element).find(".CalDate").text().trim();
      const events = [];
      $(element)
        .find("a")
        .each((i, anchor) => {
          const eventText = $(anchor).text().trim();
          const eventLink = $(anchor).attr("href");
          if (eventText) {
            events.push({ eventText, eventLink });
          }
        });
        if (day) {
          calendarEvents.push({ day, events });
        }
        // calendarEvents.push({ day, events });
    });
    res.json({ success: true, data: calendarEvents });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
});

module.exports = router;
