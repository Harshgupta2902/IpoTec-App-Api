const { Pool } = require("pg");
const express = require("express");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request params:", req.query);

  const { name, email, number, password, fcm_token } = req.query;

  try {
    // Check if the user already exists
    const existingUserResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingUserResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Insert new user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, number, password, fcm_token) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [name, email, number, password, fcm_token]
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error during signup", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
