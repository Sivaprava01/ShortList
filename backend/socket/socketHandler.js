const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Store active socket connections
const userSockets = new Map();

module.exports = (io) => {
  // Middleware for JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userEmail})`);
    
    // Store socket connection
    userSockets.set(socket.userId, socket.id);

    // Join chat room
    socket.on('join_room', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.userId} joined room chat_${chatId}`);
    });

    // Leave chat room
    socket.on('leave_room', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`User ${socket.userId} left room chat_${chatId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, text } = data;

        if (!text || !text.trim()) {
          return socket.emit('error', { message: 'Message text is required' });
        }

        // Verify user is participant in chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit('error', { message: 'Not authorized to send messages here' });
        }

        // Create message
        const message = await Message.create({
          chatId,
          senderId: socket.userId,
          text: text.trim()
        });

        // Update chat's last message
        chat.lastMessage = text.trim().substring(0, 100);
        chat.lastMessageAt = Date.now();
        await chat.save();

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'email role');

        // Emit to all participants in the room
        io.to(`chat_${chatId}`).emit('receive_message', populatedMessage);

        console.log(`Message sent in chat ${chatId} by ${socket.userId}`);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        userEmail: socket.userEmail
      });
    });

    // Stop typing
    socket.on('stop_typing', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_stop_typing', {
        userId: socket.userId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      userSockets.delete(socket.userId);
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
