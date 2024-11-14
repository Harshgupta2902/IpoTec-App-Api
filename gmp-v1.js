// scrapeDataAPI.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const url = "https://www.investorgain.com/report/live-ipo-gmp/331/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const gmp = [];
    $("#mainTable tbody tr").each((index, row) => {
      const rowData = {};
      $(row)
        .find("td")
        .each((i, cell) => {
          const cellText = $(cell).text().trim();
          switch (i) {
            case 0:
              const ipoName = $(cell).find("a").text().trim();
              const ipoBadge = $(cell).find("span.badge").text().trim();
              rowData["ipo_name"] = ipoName.replace(ipoBadge, "");
              rowData["badge"] = ipoBadge.replace("[email protected]", "");
              break;
            case 1:
              rowData["ipo_price"] = cellText;
              break;
            case 2:
              rowData["gmp"] = cellText;
              break;
            case 3:
              rowData["listing"] = cellText;
              break;
            case 4:
              rowData["ipo_size"] = cellText;
              break;
            case 5:
              rowData["lot_size"] = cellText;
              break;
            case 6:
              rowData["open"] = cellText;
              break;
            case 7:
              rowData["close"] = cellText;
              break;
            case 8:
              rowData["listing"] = cellText;
              break;
            case 9:
              rowData["updated_on"] = cellText;
              break;
            default:
              break;
          }
        });
      gmp.push(rowData);
    });

    res.json({ gmp });
  } catch (error) {
    console.error("Error occurred while scraping:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

module.exports = router;
