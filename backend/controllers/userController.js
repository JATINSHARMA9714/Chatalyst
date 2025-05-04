import userModel from "../models/userModel.js";

import * as userService from "../services/userService.js";

import { validationResult } from "express-validator";

import redisClient from "../services/redisService.js";


export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);


        const token = user.generateJWT();

        delete user._doc.password; // remove password from user object before sending it to client

        res.cookie('token', token);


        res.status(201).send({user,token});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const {email, password} = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        // sets select=false argument in schema to true for this argument only which allows this.password to get the password of the user


        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.isValidPassword(password);

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        const token = user.generateJWT();

        delete user._doc.password; // remove password from user object before sending it to client

        res.cookie('token', token);
        


        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send(error.message);
    }
}


export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(400).send(error.message);
    }

}


export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.token;

        redisClient.set(token,'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({ message: "Logged out successfully"});

    } catch (error) {
        res.status(400).send(error.message);
    }
}


export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findById(req.user.id);

        const users = await userService.getAllUsers(loggedInUser._id);
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        
        res.status(400).send(error.message);
    }
}