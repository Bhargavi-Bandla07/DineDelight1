const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3200;

// Middleware
app.use(cors()); // Allows requests from different origins (for frontend)
app.use(bodyParser.json()); // Parses JSON data from requests
app.use(express.urlencoded({ extended: true })); // Parses form data

// Connect to MongoDB
mongoose.connect("mongodb+srv://bhargavi:32939@cluster0.gdntf.mongodb.net/DineDelight", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// Serve the login HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Handle user login (store email & password in MongoDB)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ message: "Login successful! User added to MongoDB" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
