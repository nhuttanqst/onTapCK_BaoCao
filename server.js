const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dangky",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  const sql = "SELECT name FROM login WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.log("Error fetching user data:", err);
      return res.json("Error");
    } else {
      if (data.length > 0) {
        console.log("User data fetched successfully:", data[0]);
        return res.json(data[0]);
      } else {
        return res.json("User not found");
      }
    }
  });
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (name, email, password) VALUES (?,?,?)";
  const { name, email, password } = req.body;
  db.query(sql, [name, email, password], (err, data) => {
    if (err) {
      console.log("Error inserting data:", err);
      return res.json("Error");
    } else {
      console.log("Data inserted successfully:", data);
      return res.json(data);
    }
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
  const { email, password } = req.body;
  db.query(sql, [email, password], (err, data) => {
    if (err) {
      console.log("Error during login:", err);
      return res.json({ status: "Error", error: err });
    }
    if (data.length > 0) {
      return res.json({ status: "Success", user: data[0] });
    } else {
      return res.json({ status: "Invalid Email or Password" });
    }
  });
});

app.post("/update", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "UPDATE login SET name = ?, password = ? WHERE email = ?";
  db.query(sql, [name, password, email], (err, result) => {
    if (err) {
      console.log("Error updating data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows > 0) {
      console.log("Data updated successfully:", result);
      return res.status(200).json({ message: "Updated successfully" });
    } else {
      return res.status(400).json({ message: "Update failed" });
    }
  });
});

app.post("/delete", (req, res) => {
  const { email } = req.body;
  const sql = "DELETE FROM login WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log("Error deleting data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows > 0) {
      console.log("Data deleted successfully:", result);
      return res.status(200).json({ message: "Account deleted successfully" });
    } else {
      return res.status(400).json({ message: "Delete failed" });
    }
  });
});

app.listen("8081", () => {
  console.log("Server is running on port 8081");
});
