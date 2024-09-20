const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const { offset } = req.query;
  const url = `https://cmsapi.groww.in/api/v1/blogs/category/ipo?_limit=12&_start=${
    offset * 12
  }`;
  try {
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
