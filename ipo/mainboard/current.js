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
    const [data1, data2] = await Promise.all([
      axios.get("https://webnodejs.chittorgarh.com/cloud/report/data-read/83/1/12/2024/2024-25/0/0?search="),
      axios.get("https://webnodejs.chittorgarh.com/cloud/report/data-read/83/1/1/2025/2024-25/0/0?search=")
    ]);

    const ipoData = [...data1.data.reportTableData, ...data2.data.reportTableData];
    const parsedIPOs = ipoData.map((ipo) => {
      // Format dates
      const openDate = ipo["~Issue_Open_Date"]
        ? moment(ipo["~Issue_Open_Date"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";
      const closeDate = ipo["~Issue_Close_Date"]
        ? moment(ipo["~Issue_Close_Date"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";
      const listingDate = ipo["~ListingDate"]
        ? moment(ipo["~ListingDate"], "YYYY-MM-DD").format("MMM DD, YYYY")
        : "NA";

      return {
        companyName: ipo["~compare_name"],
        href:
          ipo["Issuer Company"]
            .match(/href="([^"]+)"/)?.[1]
            .replaceAll("https://www.chittorgarh.com/ipo/", "") || null,
        open: openDate,
        close: closeDate,
        listing: listingDate,
        price: ipo["Issue Price (Rs)"] || "-",
        size: ipo["Issue Size (Rs Cr.)"] || "-",
        lot: ipo["Lot Size"] || "-",
        exchange: ipo["Exchange"]
          ? ipo["Exchange"].split(",").map((e) => e.trim())
          : [],
      };
    });

    const cleanName = (name) => name.replace(/ Limited IPO$/i, "");


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
                name: cleanName(ipo.companyName),
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

    // if (type === "all") {
    //   filteredIPOs = parsedIPOs.map((ipo) => ({
    //     name: cleanName(ipo.companyName),
    //     href: ipo.href,
    //   }));
    // } else if (type === "upcoming") {
    //   filteredIPOs = parsedIPOs.filter((ipo) => {
    //     return ipo.open && moment(ipo.open, "MMM DD, YYYY").isAfter(today);
    //   });
    // } else if (type === "current") {
    //   filteredIPOs = parsedIPOs.filter((ipo) => {
    //     return (
    //       ipo.open &&
    //       ipo.listing &&
    //       today.isBetween(
    //         moment(ipo.open, "MMM DD, YYYY"),
    //         moment(ipo.listing, "MMM DD, YYYY"),
    //         null,
    //         "[]"
    //       )
    //     );
    //   });
    // } else if (type === "past") {
    //   filteredIPOs = parsedIPOs.filter((ipo) => {
    //     return (
    //       ipo.listing && moment(ipo.listing, "MMM DD, YYYY").isBefore(today)
    //     );
    //   });
    // } else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid type. Use 'upcoming', 'current', or 'past'.",
    //   });
    // }

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
