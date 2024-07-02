const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authenticateToken = require("./middlewares/authenticateToken");

require("dotenv").config();

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const posts = [
  {
    name: "nth",
    title: "post 1",
  },
  {
    name: "ytb",
    title: "post 2",
  },
];

app.use("/users", userRoutes);

app.get("/posts", authenticateToken, (req, res) => {
  if (!req.userData) {
    return res.status(403).json({ error: "User data is not available" });
  }
  console.log(req.userData.name);
  res.json({
    user: req.userData,
    posts
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
