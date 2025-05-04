import { Router } from 'express'; 

import * as userController from '../controllers/userController.js';

import { authUser } from '../middleware/authMiddleware.js';

import {body} from 'express-validator';


const router = Router();

router.post('/register', 
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    userController.createUserController); // Create a new user


router.post('/login',
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    userController.loginUserController); // Login a user


router.get('/profile',authUser, userController.getUserProfileController); // Get user profile


router.get('/logout',authUser, userController.logoutController); // Logout a user


router.get('/all',authUser, userController.getAllUsersController); // Get all users


export default router;

