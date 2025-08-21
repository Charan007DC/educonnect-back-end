const Project = require('../models/project'); 
const Student = require('../models/student'); 

// Create a new project
exports.createProject = async (req, res) => {
    try {
        // Destructure all fields from the request body, including the new 'date' field
        const { 
            title, 
            description, 
            technologies, 
            link, 
            projectfor, 
            teamtype, 
            teammembers, 
            seekingmembers,
            date 
        } = req.body;
        
        const creatorId = req.user.id;

        if (!title || !description || !projectfor) {
            return res.status(400).json({ message: 'Title, description, and project purpose are required.' });
        }

        const newProject = new Project({
            title,
            description,
            technologies: technologies || [], 
            link: link || '',
            projectfor,
            teamtype,
            teammembers: teammembers || [],
            seekingmembers,
            date,
            creator: creatorId,
            projectImage: req.file ? req.file.path : '' 
        });

        const savedProject = await newProject.save();

        // Create a summary object that matches your studentSchema
        const projectSummary = {
            title: savedProject.title,
            description: savedProject.description,
            tags: savedProject.technologies 
        };

        // Push the project summary object to the student's record
        await Student.findByIdAndUpdate(creatorId, {
            $push: { projects: projectSummary } 
        });

        res.status(201).json({ message: 'Project created successfully', project: savedProject });

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('creator', 'name institution'); 
        res.status(200).json(projects);
    } catch (error) {
        // This will print the specific database error to your server logs.
        console.error('Error fetching all projects:', error); 
        res.status(500).json({ message: 'Server error while fetching projects.' });
    }
};

// Get a single project by its ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('creator', 'name email profilePicture');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(`Error fetching project by ID (${req.params.id}):`, error);
        res.status(500).json({ message: 'Server error' });
    }
};
