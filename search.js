const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `https://groww.in/v1/api/search/v3/query/global/st_p_query?page=0&query=${query}&size=15&web=true`
    );
    const filteredContent = response.data.data.content.filter(
      (item) => item.entity_type === "IPO"
    );

    if (filteredContent.length === 0) {
      return res.json({ content: [] });
    }

    res.json({ content: filteredContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
