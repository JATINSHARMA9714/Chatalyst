import Router from 'express';
import {body} from 'express-validator';
import {createProjectController,getAllProjectsController,addUserToProjectController,getProjectByIdController} from '../controllers/projectController.js';
import {authUser} from '../middleware/authMiddleware.js';
import { get } from 'mongoose';

const router = Router();


router.post('/create',
    body('name').notEmpty().withMessage('Name is required'),
    authUser,
    createProjectController,
);


router.get('/all',
    authUser,
    getAllProjectsController,
)

router.put('/add-user',
    authUser,
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be a non-empty array').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'), //checks if each user is a string
    addUserToProjectController,
)


router.get('/get-project/:projectId',
    authUser,
    getProjectByIdController,
)








export default router;