const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data: html } = await axios.get(
      "https://www.chittorgarh.com/report/ipo-subscription-status-live-bidding-data-bse-nse/21/"
    );
    const $ = cheerio.load(html);

    const tableData = [];
    const tableRows = $("table.table-bordered tbody tr");
    tableRows.each((index, row) => {
      const columns = $(row).find("td");
      const rowData = {
        companyName: $(columns[0]).text().trim(),
        href: $(columns[0]).find("a").attr("href") || null,
        closeDate: $(columns[1]).text().trim(),
        size: $(columns[2]).text().trim(),
        qib: $(columns[3]).text().trim(),
        snii: $(columns[4]).text().trim(),
        bnni: $(columns[5]).text().trim(),
        nii: $(columns[6]).text().trim(),
        retail: $(columns[7]).text().trim(),
        employee: $(columns[8]).text().trim(),
        others: $(columns[9]).text().trim(),
        total: $(columns[10]).text().trim(),
        applications: $(columns[11]).text().trim(),
      };
      tableData.push(rowData);
    });

    res.json({ success: true, data: tableData });
  } catch (error) {
    console.error("Error fetching IPO data:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching IPO data" });
  }
});

module.exports = router;