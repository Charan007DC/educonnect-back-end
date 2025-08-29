const http = require('http');
const { Server } = require("socket.io");
const app = require('./app');
const connectDB = require('./config/db');

const server = http.createServer(app);

// --- THIS IS THE FIX ---
// The CORS origin has been simplified to its most permissive state for testing.
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (sessionId) => {
        socket.join(sessionId);
        console.log(`User ${socket.id} joined room ${sessionId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
