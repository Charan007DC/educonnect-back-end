const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../models/alumni");

// Alumni Registration
exports.registerAlumni = async (req, res) => {
  try {
    const { name, email, password, batch, department } = req.body;

    // Check if email already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new alumni
    const alumni = new Alumni({
      name,
      email,
      password: hashedPassword,
      batch,
      department,
    });

    await alumni.save();
    res.status(201).json({ message: "Alumni registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Alumni Login
exports.loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: alumni._id, role: "alumni" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, alumni });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
