const express = require("express");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

const createToken = (_id) => {
  return jwt.sign({ _id }, "process.env.SECRET", { expiresIn: "3d" });
};

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.signUp(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
