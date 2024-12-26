const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { offset = 1 } = req.query;
    const url = `https://trendlyne.com/fundamentals/all-in-one-screener-data-get/?perPageCount=25&pageNumber=${
      offset - 1
    }&columns=day_changeP%2CcurrentPrice%2CMCAP_Q%2Cday_change%2Cvol_day%2Cweek_changeP%2Cmonth_changeP%2Cqtr_changeP%2Cyear_changeP%2Cyear_high&groupType=all&groupName=&sortBy=&order=&query=day_changeP+%3E+0&filterListId=&format=json`;
    const response = await axios.get(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        referer: "https://trendlyne.com/",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
      },
    });
    const formattedData = response.data.body.tableData.map((item) => ({
      href: `${item[0]}`,
      exchange: `${item[1]}`,
      companyName: `${item[2]}`,
      symbol: `${item[3]}`,
      companyId: `${item[5]}`,
      equityType: `${item[6]}`,
      isin: `${item[7]}`,
      dayChnage: `${item[14]}`,
      currentPrice: `${item[15]}`,
      mCap: `${item[16]}`,
      dayVolume: `${item[18]}`,
      weekChange: `${item[19]}`,
      monthChamnge: `${item[20]}`,
      QtrChange: `${item[21]}`,
      yrChnage: `${item[22]}`,
      yrHigh: `${item[23]}`,
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch data from Trendlyne" });
  }
});

module.exports = router;
