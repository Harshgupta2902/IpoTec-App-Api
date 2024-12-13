const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://www.chittorgarh.com/ipo/ipo_perf_tracker.asp?year=2024"
    );
    const $ = cheerio.load(data);

    const ipoData = [];

    $("table.table tbody tr").each((i, el) => {
      const row = $(el);

      if (row.find("td[colspan]").length) return;

      const companyName = row.find("td:nth-child(1) b").text().trim();
      if (!companyName) return;
      const ipoDetailHref = row.find("td:nth-child(1) a:contains('IPO Detail')").attr("href").replaceAll("https://www.chittorgarh.com/ipo/", "");
      const listedOn = row.find("td:nth-child(2)").text().trim();
      const issuePrice = row.find("td:nth-child(3)").text().trim();
      const listingDayClose = row.find("td:nth-child(4)").text().trim();
      const listingDayGain = row.find("td:nth-child(5)").text().trim();
      const currentPrice = row.find("td:nth-child(6)").text().trim();
      const profitLoss = row.find("td:nth-child(7)").text().trim();
      ipoData.push({
        companyName,
        listedOn,
        issuePrice,
        listingDayClose,
        listingDayGain,
        currentPrice,
        profitLoss,
        href: ipoDetailHref
      });
    });
    res.json({ status: true, data: ipoData });
  } catch (error) {
    console.error("Error fetching IPO data:", error);
  }
});

module.exports = router;
