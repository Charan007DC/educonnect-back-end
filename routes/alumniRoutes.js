const express = require("express");
const router = express.Router();
const { registerAlumni, loginAlumni } = require("../controllers/alumniController");
//register 
router.post("/register", registerAlumni);
//Login
router.post("/login", loginAlumni);

module.exports = router;
