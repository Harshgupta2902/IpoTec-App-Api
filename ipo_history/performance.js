const express = require("express");
const router = express.Router();
const axios = require("axios");
const moment = require("moment");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.chittorgarh.com/ipo/ipo_perf_tracker.asp?exchange=mainline&year=2024&_rsc=1am2x"
    );
    const rawData = response.data;
    const matches = rawData.match(/"performancesDetails":\[(.*?)]/);
    if (!matches || matches.length < 2) {
      throw new Error("Could not find performancesDetails in the response.");
    }

    const performancesDetailsJson = JSON.parse(`[${matches[1]}]`).map(
      (detail) => ({
        id: `${detail.ipo_id}`,
        companyName: `${detail.ipo_company_name}`,
        faceValue: `${detail.ipo_face_value}`,
        issuePrice: `${detail.ipo_issue_price_final}`,
        href: `${detail.ipo_urlrewrite_folder_name}`,
        listingDate: moment(detail.il_ipo_listing_date).format("MMM DD, YYYY"),
        
        bseScriptCode: `${detail.il_bse_script_code}`,
        nseScriptSymbol: `${detail.il_nse_script_symbol}`,
        closePrice: `${detail.ildt_close_price}`,
        bseClose: `${detail.bse_close}`,
        bsePrevClose: `${detail.bse_prevclose}`,
        bseOpen: `${detail.bse_open}`,
        bseHigh: `${detail.bse_high}`,
        bseLow: `${detail.bse_low}`,
        bseShares: `${detail.bse_no_of_shrs}`,
        nseClose: `${detail.nse_close}`,
        nsePrevClose: `${detail.nse_prevclose}`,
        nseOpen: `${detail.nse_open}`,
        nseHigh: `${detail.nse_high}`,
        nseLow: `${detail.nse_low}`,
        changeToday: `${detail.change_today}`,
        changePercentageToday: `${detail.change_in_percentage_today}`,
        changePercentageListingDay: `${detail.change_in_percentage_listing_day}`,
        profitLoss: `${detail.ipo_profit_loss}`,
        issueSizeAmount: `${detail.ipo_issue_size_in_amt}`,
      })
    );

    console.log("Extracted IPO Performance Details:");

    res.json({ status: true, data: performancesDetailsJson });
  } catch (error) {
    console.error("Error fetching IPO data:", error);
  }
});

module.exports = router;
