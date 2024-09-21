const { Pool } = require("pg");
const express = require("express");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request params:", req.query);

  const { uuid, fcm_token, clear } = req.query;

  try {
    if (fcm_token && clear !== "true") {
      await pool.query(`UPDATE users SET fcm_token = $1 WHERE uuid = $2`, [
        fcm_token,
        uuid,
      ]);

      const updatedUserResult = await pool.query(
        `SELECT * FROM users WHERE uuid = $1`,
        [uuid]
      );

      updatedUser = updatedUserResult.rows[0];
      res.status(200).json({ message: "FCM Updated", updatedUser });
    } else if (clear === true || fcm_token) {
      await pool.query(`UPDATE users SET fcm_token = NULL WHERE uuid = $1`, [
        uuid,
      ]);
      const updatedUserResult = await pool.query(
        `SELECT * FROM users WHERE uuid = $1`,
        [uuid]
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
