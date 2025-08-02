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

  const sixMonthsAgo = today.clone().subtract(6, "months");

  try {
    const [data1] = await Promise.all([
      axios.get("https://webnodejs.investorgain.com/cloud/report/data-read/394/1/5/2025/2025-26/0/sme?search=&v=15-19"),
    ]);

    const ipoData = data1.data.reportTableData;
    const parsedIPOs = ipoData.map((ipo) => {
      const openDate = ipo["~Srt_Open"]
        ? moment(ipo["~Srt_Open"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";
      const closeDate = ipo["~Srt_Close"]
        ? moment(ipo["~Srt_Close"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";
      const listingDate = ipo["~Str_Listing"]
        ? moment(ipo["~Str_Listing"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";

      return {
        companyName: ipo["IPO"],
        href:
          ipo["~URLRewrite_Folder_Name"]
            .replaceAll("https://www.chittorgarh.com/ipo/", "") || null,
        open: openDate,
        close: closeDate,
        listing: listingDate,
        price: ipo["IPO Price"] || "-",
        size: ipo["IPO Size"].replaceAll("&#8377;", "") || "-",
        lot: String(ipo["Lot"]) || "-",
        exchange: [],
      };
    });


    // Filter out data older than 6 months
    const validIPOs = parsedIPOs.filter((ipo) => {
      const listingDate = ipo.listing ? moment(ipo.listing, "MMM DD, YYYY") : null;
      const openDate = ipo.open ? moment(ipo.open, "MMM DD, YYYY") : null;
      return (
        (listingDate && listingDate.isAfter(sixMonthsAgo)) ||
        (openDate && openDate.isAfter(sixMonthsAgo))
      );
    });

    if (type === "all") {
      filteredIPOs = validIPOs.map((ipo) => ({
        name: ipo.companyName,
        href: ipo.href,
      }));
    } else if (type === "upcoming") {
      filteredIPOs = validIPOs.filter((ipo) => {
        return ipo.open && moment(ipo.open, "MMM DD, YYYY").isAfter(today);
      });
    } else if (type === "current") {
      filteredIPOs = validIPOs.filter((ipo) => {
        return (
          ipo.open &&
          ipo.listing &&
          today.isBetween(moment(ipo.open, "MMM DD, YYYY"), moment(ipo.listing, "MMM DD, YYYY"), null, "[]")
        );
      });
    } else if (type === "past") {
      filteredIPOs = validIPOs.filter((ipo) => {
        return ipo.listing && moment(ipo.listing, "MMM DD, YYYY").isBefore(today);
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
