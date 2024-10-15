const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const menuItems = [
      {
        key: "IPO GMP",
        path: "/gmp",
      },
      {
        key: "IPO Subscription",
        path: "/subs",
      },
      {
        key: "Upcoming IPO",
        path: "/mainBoard",
      },
      {
        key: "SME IPO",
        path: "/sme",
      },
      {
        key: "BuyBack IPO",
        path: "/buyBack",
      },
      {
        key: "IPO Forms",
        path: "/forms",
      },
    ];


    const response = {
      force_update: 1,
      soft_update: 1,
      build_no: 5,
      ios_build_no: 1,
      title: "Update",
      message: "A New Version of App is available",
      show_ad: false,
      menu_items: menuItems,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


