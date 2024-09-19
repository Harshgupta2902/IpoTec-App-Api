const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = {
      force_update: 1,
      soft_update: 0,
      build_no: 2,
      ios_build_no: 1,
      title: "Testing",
      message: "TEsting 1",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
