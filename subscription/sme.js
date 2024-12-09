const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data: html } = await axios.get(
      "https://www.chittorgarh.com/report/sme-ipo-subscription-status-live-bidding-bse-nse/22/"
    );
    const $ = cheerio.load(html);

    const tableData = [];
    const tableRows = $("table.table-bordered tbody tr");
    tableRows.each((index, row) => {
      const columns = $(row).find("td");
      const rowData = {
        companyName: $(columns[0]).text().trim(),
        href: $(columns[0]).find("a").attr("href") || null,
        open: $(columns[1]).text().trim(),
        close: $(columns[2]).text().trim(),
        size: $(columns[3]).text().trim(),
        qib: $(columns[4]).text().trim(),
        nii: $(columns[5]).text().trim(),
        retail: $(columns[6]).text().trim(),
        total: $(columns[7]).text().trim(),
        applications: $(columns[8]).text().trim(),
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
