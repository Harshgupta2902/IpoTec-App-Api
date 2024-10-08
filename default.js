const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = {
      force_update: 1,
      soft_update: 1,
      build_no: 5,
      ios_build_no: 1,
      title: "Update",
      message: "A New Version of App is available",
      show_ad: false,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
