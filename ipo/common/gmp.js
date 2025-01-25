// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const cheerio = require("cheerio");

// router.get("/", async (req, res) => {
//   try {
//     const { data: html } = await axios.get(
//       "https://www.investorgain.com/report/live-ipo-gmp/331/"
//     );

//     const $ = cheerio.load(html);
//     const tableRows = $("#mainTable tbody tr");
//     const ipoData = [];

//     tableRows.each((index, row) => {
//       const columns = $(row).find("td");
//       const ipoName = $(row).find("a").text().trim();
//       const ipoBadge = $(row).find("span.badge").text().trim();
//       const ipoRow = {
//         companyName: ipoName.replaceAll(ipoBadge, ""),
//         price: $(columns[2]).text().trim(),
//         gmp: $(columns[3]).text().trim(),
//         estListing: $(columns[5]).text().trim(),
//         ipoSize: $(columns[6]).text().trim(),
//         lot: $(columns[7]).text().trim(),
//         open: $(columns[8]).text().trim(),
//         close: $(columns[9]).text().trim(),
//         boaDate: $(columns[10]).text().trim(),
//         listing: $(columns[11]).text().trim(),
//         updatedAt: $(columns[12]).text().trim(),
//       };

//       console.log(ipoRow);

//       ipoData.push(ipoRow);
//     });

//     const [mainboardResponse, smeResponse] = await Promise.all([
//       axios.get("https://ipo-tec-app-api.vercel.app/app/mainboard?type=all"),
//       axios.get("https://ipo-tec-app-api.vercel.app/app/sme?type=all"),
//     ]);

//     const additionalData = [
//       ...mainboardResponse.data.data,
//       ...smeResponse.data.data,
//     ];

//     ipoData.forEach((ipo) => {
//       const ipoWords = ipo.companyName.toLowerCase().split(" ");

//       const phrases = [];
//       for (let i = 0; i < ipoWords.length; i++) {
//         if (i + 1 < ipoWords.length) {
//           phrases.push(`${ipoWords[i]} ${ipoWords[i + 1]}`);
//         }
//         if (i + 2 < ipoWords.length) {
//           phrases.push(`${ipoWords[i]} ${ipoWords[i + 1]} ${ipoWords[i + 2]}`);
//         }
//       }

//       const match = additionalData.find((item) => {
//         const itemName = item.name.toLowerCase();
//         return phrases.some((phrase) => itemName.includes(phrase));
//       });

//       if (match) {
//         ipo.href = match.href;
//       } else {
//         ipo.href = "";
//       }
//     });

//     res.json({ success: true, data: ipoData });
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     return [];
//   }
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    // Fetch data from the new JSON API endpoint
    const { data: responseData } = await axios.get(
      "https://webnodejs.investorgain.com/cloud/report/data-read/331/1/1/2025/2024-25/0/all?search="
    );

    const ipoData = responseData.reportTableData.map((item) => {
      return {
        companyName: item.IPO,
        price: item.Price !== "NA" ? item.Price : "TBD",
        gmp: item.GMP.replace(/<[^>]*>/g, ""), // Strip HTML tags
        estListing: item["Est Listing"].replace(/<[^>]*>/g, ""),
        ipoSize: item["IPO Size"].replace(/&#8377;/g, "Rs"),
        lot: item.Lot,
        open: item.Open,
        close: item.Close,
        boaDate: item["BoA Dt"],
        listing: item.Listing,
        updatedAt: item["GMP Updated"],
        href: item["~URLRewrite_Folder_Name"].replace("/gmp/", ""),
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
