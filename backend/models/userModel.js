import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength:[6,"Email must be at least 6 characters"],
        maxLength:[50,"Email must be at most 50 characters"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select:false
    }
});


// statics called by models
// methods called by users


// Hash password before saving to the database
userSchema.statics.hashPassword = async function (password) {
    if (!password) throw new Error('Password is required');
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password with hashed password
userSchema.methods.isValidPassword = async function (password) {
    if (!password) throw new Error('Password is required');
    return await bcrypt.compare(password, this.password);
    // this.password is the hashed password stored in the database
};



// Generate JWT token
userSchema.methods.generateJWT = function () {
    return jwt.sign({ email: this.email,id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // this.email is the email of the user which calls the function
}


let userModel = mongoose.model('user', userSchema);

export default userModel;