/*
  FileName: project.js
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import ProjectModel from '../models/project.js';

// Read all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find()
            .populate({
                path: 'createdBy',
                select: 'username email',
                strictPopulate: false,
            });
        res.status(200).json(projects);
    } catch (error) {
        console.error("[getAllProjects] Error:", error.message); // log message
        res.status(500).json({ message: error.message });
    }
};

// Read a project by ID
export const getProjectById = async (req, res) => {
    try {
       const project = await ProjectModel.findById(req.params.id)
           .populate('createdBy', 'username email'); 

       if (!project){
            return res.status(404).json({ message: 'Project not found' });
       }
       
       res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new project
export const createproject = async (req, res) => {
    try {

        console.log('[createproject] req.user:', req.user);       // log user information
        console.log('[createproject] req.user.id:', req.user?.id); // check if id exists
        // createdBy field is set to the ID of the logged-in user
        const newProject = new ProjectModel({
            ...req.body,
            createdBy: req.user.id   // set createdBy to the ID of the logged-in user
        });

        const savedProject = await newProject.save(); 
        res.status(201).json(savedProject); 
    } catch (error) {
        console.error("Error in createproject:", error.message);
        res.status(500).json({ message: error.message }); 
    }
};

// Update a project by ID (only if user is the creator)
export const updateProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to update the project
    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this project.' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id).populate('createdBy');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const creatorId = project.createdBy?._id
      ? project.createdBy._id.toString()
      : project.createdBy.toString();

    if (req.user.role !== 'admin' && String(creatorId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this project.' });
    }

    await ProjectModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
};

