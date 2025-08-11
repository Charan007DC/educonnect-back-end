const Project = require('../models/project'); 
const Student = require('../models/student'); 
//Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, description, technologies, link } = req.body;
        const creatorId = req.user.id; 

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required.' });
        }

        const newProject = new Project({
            title,
            description,
            technologies: technologies || [], 
            link: link || '',
            creator: creatorId,
            projectImage: req.file ? req.file.path : '' 
        });

        const savedProject = await newProject.save();

         const projectSummary = {
            title: savedProject.title,
            description: savedProject.description,
            tags: savedProject.technologies 
        };

        await Student.findByIdAndUpdate(creatorId, {
            $push: { projects: projectSummary._id } 
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
        //.populate is  used for disoplayingg all details of the project using the id 
        const projects = await Project.find().populate('creator', 'name institution'); 
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        res.status(500).json({ message: 'Server error' });
    }
};
