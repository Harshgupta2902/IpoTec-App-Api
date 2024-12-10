
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://trendlyne.com/ipo/api/screener/least-successful/?format=json",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          referer: "https://trendlyne.com/",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch data from Trendlyne" });
  }
});

module.exports = router;
