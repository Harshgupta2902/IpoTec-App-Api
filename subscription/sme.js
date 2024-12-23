const express = require("express");
const axios = require("axios");
const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const { data: html } = await axios.get(
//       "https://www.chittorgarh.com/report/sme-ipo-subscription-status-live-bidding-bse-nse/22/"
//     );
//     const $ = cheerio.load(html);

//     const tableData = [];
//     const tableRows = $("table.table-bordered tbody tr");
//     tableRows.each((index, row) => {
//       const columns = $(row).find("td");
//       const rowData = {
//         companyName: $(columns[0]).text().trim(),
//         href:
//           $(columns[0])
//             .find("a")
//             .attr("href")
//             .replaceAll("https://www.chittorgarh.com/ipo_subscription/", "") || null,
//         // href: $(columns[0]).find("a").attr("href") || null,
//         open: $(columns[1]).text().trim(),
//         close: $(columns[2]).text().trim(),
//         size: $(columns[3]).text().trim(),
//         qib: $(columns[4]).text().trim(),
//         nii: $(columns[5]).text().trim(),
//         retail: $(columns[6]).text().trim(),
//         total: $(columns[7]).text().trim(),
//         applications: $(columns[8]).text().trim(),
//       };
//       tableData.push(rowData);
//     });

//     res.json({ success: true, data: tableData });
//   } catch (error) {
//     console.error("Error fetching IPO data:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching IPO data" });
//   }
// });

// module.exports = router;



router.get("/", async (req, res) => {
  try {
    const { data: response } = await axios.get(
      "https://webnodejs.chittorgarh.com/cloud/report/data-read/22/1/12/2024/2024-25/0/0?search="
      
    );

    if (response.msg !== 1 || !response.reportTableData) {
      return res.status(500).json({
        success: false,
        message: "Invalid data structure received from the API",
      });
    }
    const tableData = response.reportTableData.map((item) => ({
      companyName: `${item["Company Name"] || "-"}`,
      href: `${item["~URLRewrite_Folder_Name"] || null}`,
      close: `${item["Close Date"] || "-"}`,
      open: `${item["Open Date"] || "-"}`,
      size: `${item["Size (Rs Cr)"] || "-"}`,
      qib: `${item["QIB (x)"] || "-"}`,
      nii: `${item["NII (x)"] || "-"}`,
      retail: `${item["Retail (x)"] || "-"}`,
      total: `${item["Total (x)"] || "-"}`,
      applications: `${item["Applications"] || "-"}`
    }));
    
    res.json({ success: true, data: tableData });
  } catch (error) {
    console.error("Error fetching IPO data:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching IPO data" });
  }
});

module.exports = router;
