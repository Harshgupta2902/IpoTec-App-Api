const express = require("express");
const axios = require("axios");
const router = express.Router();
const moment = require("moment");


const fetchData = async (url) => {
  try {
    const { data: response } = await axios.get(url);
    if (response.msg !== 1 || !response.reportTableData) {
      throw new Error("Invalid data structure received from the API");
    }
    return response.reportTableData;
  } catch (error) {
    throw new Error("Error fetching IPO data: " + error.message);
  }
};

router.get("/", async (req, res) => {
  try {
    const url1 = "https://webnodejs.chittorgarh.com/cloud/report/data-read/22/1/12/2024/2024-25/0/0?search=";
    const url2 = "https://webnodejs.chittorgarh.com/cloud/report/data-read/22/1/1/2025/2024-25/0/0?search=";

    const data1 = await fetchData(url1);
    const data2 = await fetchData(url2);

    const combinedData = [...data2, ...data1];
    const sixMonthsAgo = moment().subtract(6, 'months');

    const filteredData = combinedData.filter((item) => {
      const closeDate = moment(item["Close Date"], "MMM DD, YYYY");
      return closeDate.isAfter(sixMonthsAgo);
    });

    const tableData = filteredData.map((item) => ({ 
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
