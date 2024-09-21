const { Pool } = require("pg");
const express = require("express");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request params:", req.query);

  const { name, email, number, password, fcm_token, uuid } = req.query;

  try {
    const existingUserResult = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND uuid = $2`,
      [email, uuid]
    );
    if (existingUserResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const result = await pool.query(
      `
      INSERT INTO users (name, email, number, password, fcm_token, uuid) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [name, email, number, password, fcm_token, uuid]
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
