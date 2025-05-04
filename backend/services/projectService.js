import projectModel from '../models/projectModel.js';
import mongoose from 'mongoose';


export const createProject = async ({name, userId}) => {

    if (!name || !userId) {
        throw new Error('Name and userId are required to create a project');
    }


    try {
        const existingProject = await projectModel.findOne({ name });
        if (existingProject) {
            throw new Error('A project with this name already exists');
        }

        const project = await projectModel.create({
            name,
            users: [userId],
        });

        return project;
    } catch (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }
}


export const getAllProjects = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required to fetch projects');
    }

    try {
        const projects = await projectModel.find({ users: userId });
        return projects;
    } catch (error) {
        throw new Error(`Error fetching projects: ${error.message}`);
    }
}

export const addUserToProject = async ({ projectId, users, userId }) => {
    if (!projectId || !users || !userId) {
        throw new Error('Project ID, users, and userId are required to add users to a project');
    }

    if (!Array.isArray(users) || !users.every(user => mongoose.Types.ObjectId.isValid(user))) {
        throw new Error('Users must be an array of valid MongoDB ObjectIds');
    }


    try {
        const project = await projectModel.findById({_id:projectId});
        if (!project) {
            throw new Error('Project not found');
        }

        // Check if the user is already in the project
        // Filter out users that are already in the project
        const newUsers = users.filter(user => !project.users.includes(user));

        if (newUsers.length === 0) {
            throw new Error('All users are already in the project');
        }

        // Add new users to the project
        project.users.push(...newUsers);
        await project.save();

        return project;
    } catch (error) {
        console.log("in service",error.message);
        throw new Error(`Error adding users to project: ${error.message}`);
    }
}


export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error('Project ID is required to fetch project details');
    }

    try {
        const project = await projectModel.find({_id:projectId}).populate('users'); // Populate user details
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }
    catch (error) {
        throw new Error(`Error fetching project: ${error.message}`);
    }
}