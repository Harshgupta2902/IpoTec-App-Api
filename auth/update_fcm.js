const { Pool } = require("pg");
const express = require("express");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request params:", req.query);

  const { email, fcm_token, clear } = req.query;

  try {
    if (fcm_token && fcm_token !== user.fcm_token) {
      await pool.query(`UPDATE users SET fcm_token = $1 WHERE email = $2`, [
        fcm_token,
        email,
      ]);

      const updatedUserResult = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );

      updatedUser = updatedUserResult.rows[0];
      res.status(200).json({ message: "FCM Updated", updatedUser });
    } else if (clear === true) {
      await pool.query(`UPDATE users SET fcm_token = NULL WHERE email = $1`, [
        email,
      ]);
      const updatedUserResult = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      const updatedUser = updatedUserResult.rows[0];
      return res.status(200).json({ message: "FCM Cleared", updatedUser });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  } catch (err) {
    console.error("Error during signup", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
