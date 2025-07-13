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
// Update a project by ID
export const updateProject = async (req, res) => {
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated document and run validators
        );
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' }); // 404 HTTP status code for not found
        }
        res.status(200).json(updatedProject); // 200 HTTP status code for success
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    }
}
// Delete a project by ID
export const deleteProject = async(req, res) => {
    try {
        const deletedProject = await ProjectModel.findByIdAndDelete(req.params.id); //db.projects.findByIdAndDelete(req.params.id) if run using mongo shell
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' }); // 404 HTTP status code for not found
        }
        res.status(200).json({ message: 'Project deleted successfully' }); // 200 HTTP status code for success
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 HTTP status code for server error
    } 
}