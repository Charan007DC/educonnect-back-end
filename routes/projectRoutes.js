const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyStudentToken = require('../middlewares/verifyStudentToken');
const upload = require('../middlewares/uploadMiddleware'); 

// Create a new project
// access is only for students
router.post(
    '/create',
    verifyStudentToken,
    upload.single('projectImage'), 
    projectController.createProject
);
//    Get all projects
router.get('/', projectController.getAllProjects);
// Get a single project by its ID
router.get('/:id', projectController.getProjectById);

module.exports = router;
