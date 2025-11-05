import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize DB table
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        student_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        department VARCHAR(50),
        semester INTEGER,
        enrollment_year INTEGER,
        date_of_birth DATE,
        address TEXT,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("Server is working!");
});

// POST - Create new student record
app.post("/api/students", async (req, res) => {
  try {
    const {
      student_id,
      name,
      email,
      phone,
      department,
      semester,
      enrollment_year,
      date_of_birth,
      address,
    } = req.body;

    // Validate required fields
    if (!student_id || !name || !email) {
      return res.status(400).json({
        message: "Missing required fields: student_id, name, and email",
      });
    }

    const student = await sql`
      INSERT INTO students(
        student_id, name, email, phone, department, semester,
        enrollment_year, date_of_birth, address
      )
      VALUES (
        ${student_id}, ${name}, ${email}, ${phone}, ${department},
        ${semester}, ${enrollment_year}, ${date_of_birth}, ${address}
      )
      RETURNING *;
    `;

    console.log("New student added:", student[0]);
    res.status(201).json(student[0]);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
