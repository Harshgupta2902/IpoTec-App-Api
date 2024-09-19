const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = {
      force_update: 0,
      soft_update: 1,
      build_no: 1,
      ios_build_no: 1,
      maintenance: 0,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
