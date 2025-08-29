const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../models/alumni");

// Alumni Registration
exports.registerAlumni = async (req, res) => {
  const { name, email, password, graduationYear, institution, department } = req.body;
  if (!name || !email || !password || !graduationYear || !institution || !department) {
    return res.status(400).json({ message: 'All fields are required' }); 
  }
  try {    
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const alumni = new Alumni({
      name,
      email,
      password: hashedPassword,
      graduationYear,
      department,
      institution,
      currentCompany: '',
      jobTitle: '',
      about: '',
      profilePicture: '',
      location: '',
      description: '',
      skills: [],
      projects: [],
      lookingFor: [],
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
    
    // The role must be capitalized to match the verifyAlumniToken middleware.
    const payload = { 
        id: alumni._id, 
        role: "Alumni" 
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    // Send a curated object for security
    res.status(200).json({ 
        message: "Login successful",
        token, 
        alumni: {
            id: alumni._id,
            name: alumni.name,
            email: alumni.email,
            role: "Alumni"
        }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
