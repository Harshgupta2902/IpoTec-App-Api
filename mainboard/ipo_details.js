const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  const { slug } = req.query;
  // const { slug } = "ipo/avanse-financial-services-ipo/1903/";
  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Invalid slug",
    });
  }

  try {
    const { data: html } = await axios.get(`https://www.chittorgarh.com/${slug}`);
    const $ = cheerio.load(html);
    const imageUrl = $('div.div-logo img').attr('src');
    const summary = [];
    $('div.col-md-12 p').each((i, element) => {
      summary.push($(element).text().trim());
    });


    const details = {
      imageUrl: imageUrl,
        summary: summary
    }

    res.json({ success: true, data: details });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
});

module.exports = router;
