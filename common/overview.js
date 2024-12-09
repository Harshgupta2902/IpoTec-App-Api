const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const mainBoardUrl = "https://www.chittorgarh.com/ipo/ipo_dashboard.asp";
    const smeUrl = "https://www.chittorgarh.com/ipo/ipo_dashboard.asp?a=sme";

    const [mainBoardResponse, smeResponse] = await Promise.all([
      axios.get(mainBoardUrl),
      axios.get(smeUrl),
    ]);

    const mainBoard$ = cheerio.load(mainBoardResponse.data);
    const sme$ = cheerio.load(smeResponse.data);

    const mainBoardData = {
      total: parseInt(mainBoard$("p.text-primary.h4.mb-0").first().text()),
      listed_in_gain: parseInt(
        mainBoard$("p.text-success.h4.mb-0").eq(0).text()
      ),
      listed_in_loss: parseInt(
        mainBoard$("p.text-danger.h4.mb-0").eq(0).text()
      ),
      listed_in_gain_eod: parseInt(
        mainBoard$("p.text-success.h4.mb-0").eq(1).text()
      ),
      listed_in_loss_eod: parseInt(
        mainBoard$("p.text-danger.h4.mb-0").eq(1).text()
      ),
    };

    const smeData = {
      total: parseInt(sme$("p.text-primary.h4.mb-0").first().text()),
      listed_in_gain: parseInt(sme$("p.text-success.h4.mb-0").eq(0).text()),
      listed_in_loss: parseInt(sme$("p.text-danger.h4.mb-0").eq(0).text()),
      listed_in_gain_eod: parseInt(sme$("p.text-success.h4.mb-0").eq(1).text()),
      listed_in_loss_eod: parseInt(sme$("p.text-danger.h4.mb-0").eq(1).text()),
    };

    const result = {
      main_board: mainBoardData,
      sme: smeData,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).json({ success: false, message: "Error scraping data" });
  }
});

module.exports = router;
