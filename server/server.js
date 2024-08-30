import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { Message } from './models/messageModel.js';
import { User } from './models/userModel.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('user connected', async (username) => {
    onlineUsers[username] = socket.id;
    io.emit('user status', { username, status: 'online' });
    console.log(`${username} is online`);

    // Send undelivered messages to the user
    try {
      const undeliveredMessages = await Message.find({ to: username, delivered: false });
      for (const message of undeliveredMessages) {
        socket.emit('personal chat message', message);
        message.delivered = true;
        await message.save();
      }
    } catch (error) {
      console.error('Error fetching undelivered messages:', error);
    }
  });

  socket.on('get users', async () => {
    try {
      const users = await User.find().select('username');
      const usersWithStatus = users.map(user => ({
        username: user.username,
        status: onlineUsers[user.username] ? 'online' : 'offline'
      }));
      socket.emit('users list', usersWithStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  });

  socket.on('get chat history', async (selectedUser) => {
    try {
      const username = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
      const messages = await Message.find({
        $or: [
          { username, to: selectedUser },
          { username: selectedUser, to: username }
        ]
      }).sort({ timestamp: 1 });
      socket.emit('chat history', messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  });

  socket.on('personal chat message', async (msg) => {
    if (!msg.username) {
      console.error('Username is missing in the message payload');
      return;
    }

    try {
      const message = new Message({
        username: msg.username,
        text: msg.text,
        to: msg.to,
        timestamp: new Date(),
        delivered: false,
      });
      await message.save();

      const recipientSocketId = onlineUsers[msg.to];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('personal chat message', message);
        message.delivered = true;
        await message.save();
      }
      // Emit message back to the sender
      socket.emit('personal chat message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    const username = Object.keys(onlineUsers).find(username => onlineUsers[username] === socket.id);
    if (username) {
      delete onlineUsers[username];
      io.emit('user status', { username, status: 'offline' });
      console.log(`${username} is offline`);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
