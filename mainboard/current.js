// const cheerio = require("cheerio");
// const express = require("express");
// const moment = require("moment");
// const axios = require("axios");
// const router = express.Router();

// router.get("/", async (req, res) => {
//   const { type } = req.query;

//   if (!type) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid request",
//     });
//   }

//   const today = moment();
//   let filteredIPOs = [];

//   try {
//     const { data: html } = await axios.get(
//       "https://www.chittorgarh.com/report/mainboard-ipo-list-in-india-bse-nse/83/"
//     );
//     const $ = cheerio.load(html);

//     const tableData = [];
//     const tableRows = $("#report_table tbody tr");

//     console.log($.html());
//     console.log("Number of rows found:", tableRows.length);

//     tableRows.each((index, row) => {
//       const columns = $(row).find("td");

//       const exchangeText = $(columns[7]).find("div").text().trim(); // Adjusted to find text inside <div>
//       const rowData = {
//         companyName: $(columns[0]).find("a").text().trim(),
//         href: $(columns[0])
//           .find("a")
//           .attr("href")
//           ?.replace("https://www.chittorgarh.com/ipo/", "") || null,
//         open: $(columns[1]).find("div").text().trim(),
//         close: $(columns[2]).find("div").text().trim(),
//         listing: $(columns[3]).find("div").text().trim(),
//         price: $(columns[4]).find("div").text().trim(),
//         size: $(columns[5]).find("div").text().trim(),
//         lot: $(columns[6]).find("div").text().trim(),
//         exchange: exchangeText
//           ? exchangeText.split(",").map((e) => e.trim())
//           : [],
//       };
//       tableData.push(rowData);
//     });

//     console.log("Scraped Table Data:", tableData);

//     const cleanName = (name) => name.replace(/ Limited IPO$/i, "");

//     if (type === "all") {
//       filteredIPOs = tableData.map((ipo) => ({
//         name: cleanName(ipo.companyName),
//         href: ipo.href,
//       }));
//       res.json({ success: true, data: filteredIPOs });
//       return;
//     }

//     if (type === "upcoming") {
//       filteredIPOs = tableData.filter((ipo) => {
//         const openDate = ipo.open ? moment(ipo.open, "MMM DD, YYYY") : null;
//         return openDate && openDate.isAfter(today);
//       });
//     } else if (type === "current") {
//       filteredIPOs = tableData.filter((ipo) => {
//         const openDate = ipo.open ? moment(ipo.open, "MMM DD, YYYY") : null;
//         const listingDate = ipo.listing
//           ? moment(ipo.listing, "MMM DD, YYYY")
//           : null;
//         return (
//           openDate &&
//           listingDate &&
//           today.isBetween(openDate, listingDate, null, "[]")
//         );
//       });
//     } else if (type === "past") {
//       filteredIPOs = tableData.filter((ipo) => {
//         const listingDate = ipo.listing
//           ? moment(ipo.listing, "MMM DD, YYYY")
//           : null;
//         return listingDate && listingDate.isBefore(today);
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid type. Use 'upcoming', 'current', or 'past'.",
//       });
//     }

//     filteredIPOs.sort((a, b) => {
//       const dateA = a.open ? moment(a.open, "MMM DD, YYYY") : null;
//       const dateB = b.open ? moment(b.open, "MMM DD, YYYY") : null;

//       if (!dateA) return 1;
//       if (!dateB) return -1;
//       return dateA - dateB;
//     });

//     res.json({ success: true, data: filteredIPOs });
//   } catch (error) {
//     console.error("Error fetching IPO data:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching IPO data" });
//   }
// });

// module.exports = router;

const axios = require("axios");
const moment = require("moment");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }

  const today = moment();
  let filteredIPOs = [];

  try {
    const { data } = await axios.get(
      "https://webnodejs.chittorgarh.com/cloud/report/data-read/83/1/12/2024/2024-25/0/0?search="
    );

    const ipoData = data.reportTableData || [];
    const parsedIPOs = ipoData.map((ipo) => ({
      companyName: ipo["~compare_name"],
      href:
        ipo["Issuer Company"]
          .match(/href="([^"]+)"/)?.[1]
          .replace("https://www.chittorgarh.com/ipo/", "") || null,
      open: ipo["~Issue_Open_Date"]
        ? moment(ipo["~Issue_Open_Date"], "YYYY-MM-DD")
        : null,
      close: ipo["~Issue_Close_Date"]
        ? moment(ipo["~Issue_Close_Date"], "YYYY-MM-DD")
        : null,
      listing: ipo["~ListingDate"]
        ? moment(ipo["~ListingDate"], "YYYY-MM-DD")
        : null,
      price: ipo["Issue Price (Rs)"] || null,
      size: ipo["Issue Size (Rs Cr.)"] || null,
      lot: ipo["Lot Size"] || null,
      exchange: ipo["Exchange"]
        ? ipo["Exchange"].split(",").map((e) => e.trim())
        : [],
    }));

    const cleanName = (name) => name.replace(/ Limited IPO$/i, "");

    if (type === "all") {
      filteredIPOs = parsedIPOs.map((ipo) => ({
        name: cleanName(ipo.companyName),
        href: ipo.href,
      }));
    } else if (type === "upcoming") {
      filteredIPOs = parsedIPOs.filter((ipo) => {
        return ipo.open && ipo.open.isAfter(today);
      });
    } else if (type === "current") {
      filteredIPOs = parsedIPOs.filter((ipo) => {
        return (
          ipo.open &&
          ipo.close &&
          today.isBetween(ipo.open, ipo.close, null, "[]")
        );
      });
    } else if (type === "past") {
      filteredIPOs = parsedIPOs.filter((ipo) => {
        return ipo.listing && ipo.listing.isBefore(today);
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'upcoming', 'current', or 'past'.",
      });
    }

    filteredIPOs.sort((a, b) => {
      const dateA = a.open || moment(0);
      const dateB = b.open || moment(0);
      return dateA - dateB;
    });

    res.json({ success: true, data: filteredIPOs });
  } catch (error) {
    console.error("Error fetching IPO data:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching IPO data",
    });
  }
});

module.exports = router;
