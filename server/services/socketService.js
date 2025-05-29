import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-course', (courseId) => {
      socket.join(`course-${courseId}`);
    });

    socket.on('leave-course', (courseId) => {
      socket.leave(`course-${courseId}`);
    });

    socket.on('student-progress-update', (data) => {
      io.to(`course-${data.courseId}`).emit('progress-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};