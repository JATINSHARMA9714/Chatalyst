import mongoose from 'mongoose';



const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('MongoDB connected successfully');
    }).catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    }   );
}

export default connectDB;