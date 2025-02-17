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
      return {
        companyName: item.IPO,
        price: item.Price !== "NA" ? item.Price : "--",
        gmp: item.GMP ? item.GMP.replace(/<[^>]*>/g, "") : "",
        estListing: item["Est Listing"] ? item["Est Listing"].replace(/<[^>]*>/g, "") : "",
        ipoSize: item["IPO Size"] ? item["IPO Size"].replace(/&#8377;/g, "Rs") : "",
        lot: item.Lot,
        open: item.Open,
        close: item.Close,
        boaDate: item["BoA Dt"],
        listing: item.Listing,
        updatedAt: item["GMP Updated"],
        href: item["~URLRewrite_Folder_Name"] ?item["~URLRewrite_Folder_Name"].replace("/gmp/", "") : "",
      };
    });

    // Fetch additional data from mainboard and SME APIs
    const [mainboardResponse, smeResponse] = await Promise.all([
      axios.get("https://ipo-tec-app-api.vercel.app/app/mainboard?type=all"),
      axios.get("https://ipo-tec-app-api.vercel.app/app/sme?type=all"),
    ]);

    const additionalData = [
      ...mainboardResponse.data.data,
      ...smeResponse.data.data,
    ];

    // Match and add additional href if available
    ipoData.forEach((ipo) => {
      const ipoWords = ipo.companyName.toLowerCase().split(" ");

      const phrases = [];
      for (let i = 0; i < ipoWords.length; i++) {
        if (i + 1 < ipoWords.length) {
          phrases.push(`${ipoWords[i]} ${ipoWords[i + 1]}`);
        }
        if (i + 2 < ipoWords.length) {
          phrases.push(`${ipoWords[i]} ${ipoWords[i + 1]} ${ipoWords[i + 2]}`);
        }
      }

      const match = additionalData.find((item) => {
        const itemName = item.name.toLowerCase();
        return phrases.some((phrase) => itemName.includes(phrase));
      });

      if (match) {
        ipo.href = match.href;
      }
    });

    res.json({ success: true, data: ipoData });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

module.exports = router;
