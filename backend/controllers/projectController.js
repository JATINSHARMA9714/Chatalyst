import projectModel from "../models/projectModel.js";

import * as projectService from "../services/projectService.js";
import { validationResult } from "express-validator";


export const createProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name } = req.body;
        const userId = req.user.id; // Assuming you have user ID in req.user

        const project = await projectService.createProject({ name, userId });

        res.status(200).json(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const getAllProjectsController = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID in req.user

        const projects = await projectService.getAllProjects(userId);

        res.status(200).json(projects);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const addUserToProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }



    try {
        const { projectId, users } = req.body;
        const userId = req.user.id; // Assuming you have user ID in req.user

        const project = await projectService.addUserToProject({ projectId, users, userId });

        res.status(200).json(project);
    } catch (error) {
        console.log("in controller",error.message);
        
        res.status(400).send(error.message);
    }
}


export const getProjectByIdController = async (req, res) => {
    try {
        const { projectId } = req.params;
        

        const project = await projectService.getProjectById({ projectId});

        res.status(200).json(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
