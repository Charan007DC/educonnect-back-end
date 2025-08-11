const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Project title is required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required.']
    },
    technologies: [{
        type: String,
        trim: true
    }],
    link: { 
        type: String,
        trim: true
    },
    projectImage: { 
        type: String, 
        default: ''
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'student' 
    },
    collaborators: [{ 
        collaboratorId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'collaboratorModel'
        },
        collaboratorModel: {
            type: String,
            required: true,
            enum: ['Student', 'Alumni']
        }
    }],
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
        default: 'In Progress'
    }
}, { timestamps: true }); 

const Project = mongoose.model('project', projectSchema);

module.exports = Project;
