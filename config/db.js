const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('FATAL ERROR: MONGO_URI is not defined.');
            process.exit(1);
        }
        
        await mongoose.connect(mongoURI);
        
        console.log('✅ MongoDB connected successfully.');
    } catch (err) {
        console.error('❌ FATAL ERROR: MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
