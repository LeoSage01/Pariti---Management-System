import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const router = express.Router();

// To generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
};

// For login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("login", {
      message: "Please provide both email and password.",
    });
  }

  con.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.json({
          loginStatus: false,
          Error: "Please provide both email and password.",
        });
      }
      if (
        results.length === 0 ||
        !(await bcrypt.compare(password, results[0].password))
      ) {
        console.error("Error in login query:", error);
        return res.status(500).json({
          loginStatus: false,
          Error: "Internal server error.",
        });
      } else {
        // Generate and send a JWT token
        const token = generateToken(results[0].id);
        const userName = results[0].name;
        return res.json({
          loginStatus: true,
          token: token,
          user: {
            userName: userName,
          },
        });
      }
    }
  );
});

// For signup
router.post("/signup", (req, res) => {
  const { name, email, password, password_confirm } = req.body;

  con.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        return res.status(500).json({
          registerStatus: false,
          error: "Internal server error.",
        });
      }
      if (results.length > 0) {
        return res.status(400).json({
          registerStatus: false,
          error: "This email is already in use",
        });
      } else if (password !== password_confirm) {
        return res.status(400).json({
          registerStatus: false,
          error: "Passwords do not match!",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 10);

      con.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            return res.status(500).json({
              registerStatus: false,
              error: "Internal server error.",
            });
          } else {
            // Generate and send a JWT token after successfully registering a user
            console.log(results);
            const token = generateToken(results.insertId);
            return res.status(201).json({
              registerStatus: true,
              token: token,
            });
          }
        }
      );
    }
  );
});

export { router as authRouter };
