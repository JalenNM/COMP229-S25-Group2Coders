/*
  FileName: project.js
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import express from 'express';
import { createproject, deleteProject, getAllProjects, getProjectById, updateProject } from '../controllers/project.js';
import authMiddleware, { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// HTTP Verbs for RESTful API GET, POST, PUT, DELETE

// GET /api/projects
router.get('/', getAllProjects);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// POST /api/projects
router.post('/', authMiddleware, createproject);

// PUT /api/projects/:id
router.put('/:id', authMiddleware, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', authMiddleware, isAdmin, deleteProject);


export default router;