import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sql } from "./config/db.js";
import { hashPassword, verifyPassword } from "./services/passwordService.js";
import { generateToken } from "./services/jwtService.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize DB tables
async function initDB() {
  try {
    // Students table with auth
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        department VARCHAR(50),
        semester INTEGER,
        enrollment_year INTEGER,
        date_of_birth DATE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    // Faculty table with auth
    await sql`
      CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        faculty_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        department VARCHAR(50),
        designation VARCHAR(50),
        joining_date DATE,
        specialization TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    // Parents table with auth
    await sql`
      CREATE TABLE IF NOT EXISTS parents (
        id SERIAL PRIMARY KEY,
        parent_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        student_id VARCHAR(20),
        relationship VARCHAR(20),
        occupation VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
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

// ============= AUTH ROUTES =============

// Token verification endpoint
app.get("/api/auth/verify", authMiddleware, async (req, res) => {
  try {
    // User data is already attached to req.user by authMiddleware
    // Return the user data and role from the decoded token
    res.status(200).json({
      success: true,
      user: {
        userId: req.user.userId,
        email: req.user.email
      },
      role: req.user.role
    });
  } catch (error) {
    // Structured error logging for token verification failures
    console.error("[AUTH ERROR] Token verification failed:", {
      timestamp: new Date().toISOString(),
      errorType: "TOKEN_VERIFICATION_ERROR",
      errorMessage: error.message,
      userId: req.user?.userId || "unknown",
      role: req.user?.role || "unknown",
      path: req.path
    });
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  // Since we're using JWT tokens, logout is handled client-side by removing the token
  // This endpoint provides a consistent API interface and can be extended for token blacklisting if needed
  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});

// Login endpoint - handles all three roles
app.post("/api/auth/login", async (req, res) => {
  const { userId, password, role } = req.body;
  
  try {
    if (!userId || !password || !role) {
      console.error("[AUTH ERROR] Login validation failed:", {
        timestamp: new Date().toISOString(),
        errorType: "VALIDATION_ERROR",
        errorMessage: "Missing required fields",
        userId: userId || "missing",
        role: role || "missing",
        path: req.path
      });
      
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, password, and role",
      });
    }

    let user;
    let idField;

    // Determine which table to query based on role
    switch (role) {
      case "student":
        idField = "student_id";
        break;
      case "faculty":
        idField = "faculty_id";
        break;
      case "parent":
        idField = "parent_id";
        break;
      default:
        console.error("[AUTH ERROR] Login validation failed:", {
          timestamp: new Date().toISOString(),
          errorType: "VALIDATION_ERROR",
          errorMessage: "Invalid role",
          userId: userId,
          role: role,
          path: req.path
        });
        
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be student, faculty, or parent",
        });
    }

    // Query the appropriate table
    if (role === "student") {
      user = await sql`
        SELECT * FROM students WHERE student_id = ${userId}
      `;
    } else if (role === "faculty") {
      user = await sql`
        SELECT * FROM faculty WHERE faculty_id = ${userId}
      `;
    } else if (role === "parent") {
      user = await sql`
        SELECT * FROM parents WHERE parent_id = ${userId}
      `;
    }

    if (!user || user.length === 0) {
      // Log failed login attempt - user not found
      console.error("[AUTH ERROR] Login failed - User not found:", {
        timestamp: new Date().toISOString(),
        errorType: "AUTHENTICATION_FAILED",
        errorMessage: "User not found",
        userId: userId,
        role: role,
        path: req.path
      });
      
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(password, user[0].password);
    
    if (!isPasswordValid) {
      // Log failed login attempt - invalid password
      console.error("[AUTH ERROR] Login failed - Invalid password:", {
        timestamp: new Date().toISOString(),
        errorType: "AUTHENTICATION_FAILED",
        errorMessage: "Invalid password",
        userId: userId,
        role: role,
        path: req.path
      });
      
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user[0][idField],
      role: role,
      email: user[0].email
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];

    // For parent role, fetch linked student information if student_id exists
    let linkedStudent = null;
    if (role === "parent" && user[0].student_id) {
      const studentData = await sql`
        SELECT id, student_id, name, email, phone, department, semester, 
               enrollment_year, date_of_birth, address, created_at
        FROM students 
        WHERE student_id = ${user[0].student_id}
      `;
      
      if (studentData && studentData.length > 0) {
        linkedStudent = studentData[0];
      }
    }

    // Log successful login (info level)
    console.log("[AUTH INFO] Login successful:", {
      timestamp: new Date().toISOString(),
      userId: userId,
      role: role,
      path: req.path
    });

    const response = {
      success: true,
      message: "Login successful",
      token: token,
      user: userWithoutPassword,
      role: role,
    };

    // Add linked student information to response if available
    if (linkedStudent) {
      response.linkedStudent = linkedStudent;
    }

    res.status(200).json(response);
  } catch (error) {
    // Log database or system errors with details
    console.error("[AUTH ERROR] Login system error:", {
      timestamp: new Date().toISOString(),
      errorType: "SYSTEM_ERROR",
      errorMessage: error.message,
      errorStack: error.stack,
      userId: userId || "unknown",
      role: role || "unknown",
      path: req.path
    });
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Register Student
app.post("/api/auth/register/student", async (req, res) => {
  const { student_id, name, email, password } = req.body;
  
  try {
    const {
      phone,
      department,
      semester,
      enrollment_year,
      date_of_birth,
      address,
    } = req.body;

    if (!student_id || !name || !email || !password) {
      console.error("[AUTH ERROR] Student registration validation failed:", {
        timestamp: new Date().toISOString(),
        errorType: "VALIDATION_ERROR",
        errorMessage: "Missing required fields",
        studentId: student_id || "missing",
        email: email || "missing",
        path: req.path
      });
      
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    const student = await sql`
      INSERT INTO students(
        student_id, name, email, password, phone, department, semester,
        enrollment_year, date_of_birth, address
      )
      VALUES (
        ${student_id}, ${name}, ${email}, ${hashedPassword}, ${phone}, ${department},
        ${semester}, ${enrollment_year}, ${date_of_birth}, ${address}
      )
      RETURNING id, student_id, name, email, phone, department, semester, enrollment_year, date_of_birth, address, created_at;
    `;

    console.log("[AUTH INFO] Student registered successfully:", {
      timestamp: new Date().toISOString(),
      studentId: student_id,
      email: email,
      path: req.path
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user: student[0],
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      console.error("[AUTH ERROR] Student registration failed - Duplicate:", {
        timestamp: new Date().toISOString(),
        errorType: "DUPLICATE_ERROR",
        errorMessage: "Student ID or email already exists",
        studentId: student_id,
        email: email,
        path: req.path
      });
      
      return res.status(409).json({
        success: false,
        message: "Student ID or email already exists",
      });
    }
    
    // Log database errors with details
    console.error("[AUTH ERROR] Student registration database error:", {
      timestamp: new Date().toISOString(),
      errorType: "DATABASE_ERROR",
      errorMessage: error.message,
      errorCode: error.code,
      studentId: student_id || "unknown",
      email: email || "unknown",
      path: req.path
    });
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Register Faculty
app.post("/api/auth/register/faculty", async (req, res) => {
  const { faculty_id, name, email, password } = req.body;
  
  try {
    const {
      phone,
      department,
      designation,
      joining_date,
      specialization,
      address,
    } = req.body;

    if (!faculty_id || !name || !email || !password) {
      console.error("[AUTH ERROR] Faculty registration validation failed:", {
        timestamp: new Date().toISOString(),
        errorType: "VALIDATION_ERROR",
        errorMessage: "Missing required fields",
        facultyId: faculty_id || "missing",
        email: email || "missing",
        path: req.path
      });
      
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    const faculty = await sql`
      INSERT INTO faculty(
        faculty_id, name, email, password, phone, department, designation,
        joining_date, specialization, address
      )
      VALUES (
        ${faculty_id}, ${name}, ${email}, ${hashedPassword}, ${phone}, ${department},
        ${designation}, ${joining_date}, ${specialization}, ${address}
      )
      RETURNING id, faculty_id, name, email, phone, department, designation, joining_date, specialization, address, created_at;
    `;

    console.log("[AUTH INFO] Faculty registered successfully:", {
      timestamp: new Date().toISOString(),
      facultyId: faculty_id,
      email: email,
      path: req.path
    });

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      user: faculty[0],
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      console.error("[AUTH ERROR] Faculty registration failed - Duplicate:", {
        timestamp: new Date().toISOString(),
        errorType: "DUPLICATE_ERROR",
        errorMessage: "Faculty ID or email already exists",
        facultyId: faculty_id,
        email: email,
        path: req.path
      });
      
      return res.status(409).json({
        success: false,
        message: "Faculty ID or email already exists",
      });
    }
    
    // Log database errors with details
    console.error("[AUTH ERROR] Faculty registration database error:", {
      timestamp: new Date().toISOString(),
      errorType: "DATABASE_ERROR",
      errorMessage: error.message,
      errorCode: error.code,
      facultyId: faculty_id || "unknown",
      email: email || "unknown",
      path: req.path
    });
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Register Parent
app.post("/api/auth/register/parent", async (req, res) => {
  const { parent_id, name, email, password, student_id } = req.body;
  
  try {
    const {
      phone,
      relationship,
      occupation,
      address,
    } = req.body;

    if (!parent_id || !name || !email || !password) {
      console.error("[AUTH ERROR] Parent registration validation failed:", {
        timestamp: new Date().toISOString(),
        errorType: "VALIDATION_ERROR",
        errorMessage: "Missing required fields",
        parentId: parent_id || "missing",
        email: email || "missing",
        path: req.path
      });
      
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate student_id if provided
    if (student_id) {
      const studentExists = await sql`
        SELECT student_id FROM students WHERE student_id = ${student_id}
      `;
      
      if (!studentExists || studentExists.length === 0) {
        console.error("[AUTH ERROR] Parent registration validation failed:", {
          timestamp: new Date().toISOString(),
          errorType: "VALIDATION_ERROR",
          errorMessage: "Invalid student_id",
          parentId: parent_id,
          studentId: student_id,
          path: req.path
        });
        
        return res.status(400).json({
          success: false,
          message: "Invalid student_id: Student does not exist",
        });
      }
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    const parent = await sql`
      INSERT INTO parents(
        parent_id, name, email, password, phone, student_id, relationship,
        occupation, address
      )
      VALUES (
        ${parent_id}, ${name}, ${email}, ${hashedPassword}, ${phone}, ${student_id},
        ${relationship}, ${occupation}, ${address}
      )
      RETURNING id, parent_id, name, email, phone, student_id, relationship, occupation, address, created_at;
    `;

    console.log("[AUTH INFO] Parent registered successfully:", {
      timestamp: new Date().toISOString(),
      parentId: parent_id,
      email: email,
      linkedStudentId: student_id || "none",
      path: req.path
    });

    res.status(201).json({
      success: true,
      message: "Parent registered successfully",
      user: parent[0],
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      console.error("[AUTH ERROR] Parent registration failed - Duplicate:", {
        timestamp: new Date().toISOString(),
        errorType: "DUPLICATE_ERROR",
        errorMessage: "Parent ID or email already exists",
        parentId: parent_id,
        email: email,
        path: req.path
      });
      
      return res.status(409).json({
        success: false,
        message: "Parent ID or email already exists",
      });
    }
    
    // Log database errors with details
    console.error("[AUTH ERROR] Parent registration database error:", {
      timestamp: new Date().toISOString(),
      errorType: "DATABASE_ERROR",
      errorMessage: error.message,
      errorCode: error.code,
      parentId: parent_id || "unknown",
      email: email || "unknown",
      path: req.path
    });
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
