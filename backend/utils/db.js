import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            throw new Error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI.');
        }
        await mongoose.connect(uri);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;