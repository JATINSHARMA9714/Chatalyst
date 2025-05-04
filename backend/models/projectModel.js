import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:[true,'Project name must be unique'],
        trim:true,
    },
    users:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        }
    ]
});

const projectModel = mongoose.model('projects', projectSchema);

export default projectModel;