
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});


// --- START THE SERVER ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

server.on('error', (error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
