import express from 'express';
import { createproject, deleteProject, getAllProjects, getProjectById, updateProject } from '../controllers/project.js';

const router = express.Router();

// HTTP Verbs for RESTful API GET, POST, PUT, DELETE

// GET /api/projects
router.get('/', getAllProjects);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// POST /api/projects
router.post('/', createproject);

// PUT /api/projects/:id
router.put('/:id', updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject)

export default router;