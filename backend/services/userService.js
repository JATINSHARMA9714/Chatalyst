// all the 3rd party app interactions


import userModel from "../models/userModel.js";

export const createUser = async ({email, password}) => {

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);


    const user = await userModel.create({
        email: email,
        password: hashedPassword
    });

    return user;
}


export const getAllUsers = async (userId) => {
    const users = await userModel.find({_id: { $ne: userId }}).select('-password'); // exclude password field from the result
    return users;
}