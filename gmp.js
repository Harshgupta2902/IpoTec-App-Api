const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const { data: html } = await axios.get(
      "https://www.investorgain.com/report/live-ipo-gmp/331/all/"
    );

    const $ = cheerio.load(html);
    const tableRows = $("#mainTable tbody tr");
    const ipoData = [];

    tableRows.each((index, row) => {
      const columns = $(row).find("td");
      const ipoName = $(row).find("a").text().trim();
      const ipoBadge = $(row).find("span.badge").text().trim();
      const ipoRow = {
        companyName: ipoName.replaceAll(ipoBadge, ""),
        price: $(columns[1]).text().trim(),
        gmp: $(columns[2]).text().trim(),
        estListing: $(columns[3]).text().trim(),
        ipoSize: $(columns[5]).text().trim(),
        lot: $(columns[6]).text().trim(),
        open: $(columns[7]).text().trim(),
        close: $(columns[8]).text().trim(),
        boaDate: $(columns[9]).text().trim(),
        listing: $(columns[10]).text().trim(),
        updatedAt: $(columns[11]).text().trim(),
      };

      ipoData.push(ipoRow);
    });
    res.json({ success: true, data: ipoData });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
});

module.exports = router;
