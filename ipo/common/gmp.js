const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    // Fetch data from the new JSON API endpoint
    const { data: responseData } = await axios.get(
      "https://webnodejs.investorgain.com/cloud/report/data-read/331/1/2/2025/2024-25/0/all?search="
    );

    const ipoData = responseData.reportTableData.map((item) => {
      const listingPrice = item["Est Listing"] ? item["Est Listing"].replace(/<[^>]*>/g, "") : "";

      const rawName = item["Name"] || "";
      const nameMatch = rawName.match(/title="([^"]+)"/);
      const companyName = nameMatch ? nameMatch[1] : rawName.replace(/<[^>]*>/g, "").trim();

      const gmpMatch = listingPrice.match(/\(([^)]+)\)/);
      const gmp = gmpMatch ? gmpMatch[1] : "";
      return {
        companyName: companyName,
        price: item.Price !== "NA" ? item.Price : "--",
        gmp: gmp,
        estListing: listingPrice,
        ipoSize: item["IPO Size"] ? item["IPO Size"].replace(/&#8377;/g, "Rs") : "",
        lot: item.Lot,
        open: item.Open,
        close: item.Close,
        boaDate: item["BoA Dt"],
        listing: item.Listing,
        updatedAt: item["GMP Updated"],
        href: item["~urlrewrite_folder_name"] ?item["~urlrewrite_folder_name"]: "",
      };
    });

    res.json({ success: true, data: ipoData });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

module.exports = router;
