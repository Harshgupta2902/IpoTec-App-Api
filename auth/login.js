const { Pool } = require("pg");
const express = require("express");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request params:", req.query);

  const { email, password, fcm_token } = req.query;

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Email not exists" });
    }

    const user = userResult.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    let updatedUser = user;

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
    }


    res.status(200).json({ message: "Login successful", updatedUser });
  } catch (err) {
    console.error("Error during signup", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
