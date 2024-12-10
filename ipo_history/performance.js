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
      });
    });

    const performanceData = [];
    $("table.table-bordered tbody tr").each((i, el) => {
      const row = $(el);
      const companyName = row.find("td:nth-child(1)").text().trim();
      const listingDayGain = row.find("td:nth-child(2)").text().trim();
      const currentGainLoss = row.find("td:nth-child(3)").text().trim();

      if (!companyName) return;

      performanceData.push({
        companyName,
        listingDayGain,
        currentGainLoss,
      });
    });

    ipoData.forEach((ipo) => {
      const performance = performanceData.find(
        (perf) => perf.companyName === ipo.companyName
      );
      if (performance) {
        ipo.performance = performance;
      }
    });

    res.json({ status: true, data: ipoData });
  } catch (error) {
    console.error("Error fetching IPO data:", error);
  }
});

module.exports = router;
