const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// This imports your app configuration from app.js
const app = require('./app');

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ MongoDB connected successfully.');
        
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(' FATAL ERROR: MongoDB connection failed:', err);
        process.exit(1);
    });
