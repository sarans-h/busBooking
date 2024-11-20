const app=require('./app');
const cloudinary=require('cloudinary');
const connectDB=require('./config/database.js');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Socket.io


connectDB();

const PORT = process.env.PORT || 5000; // Change 5000 to another available port if necessary

const server = http.createServer(app); // Create the http server
const io = new Server(server, {
  cors: {
    origin: '*', // Configure the origin as needed for your app
    methods: ['GET', 'POST', 'PUT']
  },
  pingTimeout: 30000, // 30 seconds before a ping timeout occurs
  pingInterval: 15000
});


let selectedSeats = new Map();
let viewingUsers = new Map();
let u=null;
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinBus', ({ busId }) => {
    socket.join(busId);
    console.log(`User ${socket.id} joined bus room: ${busId}`);

    // Initialize and emit data for that specific busId room
    const busData = {
      selectedSeats: selectedSeats.get(busId) || [],
      viewingUsers: viewingUsers.get(busId) || 0
    };

    // Increment viewing users for this busId
    viewingUsers.set(busId, (viewingUsers.get(busId) || 0) + 1);
    io.to(busId).emit('viewingUsersUpdate', { viewingUsers: viewingUsers.get(busId) });

    // Send initial data to the client
    socket.emit('initialData', busData);
  });

  socket.on('seatSelected', ({ seatNumber, userId, busId }) => {
    console.log(seatNumber,userId,busId);
u=userId;
    // Initialize the selected seats array for the bus if not existing
    if (!selectedSeats.has(busId)) selectedSeats.set(busId, []);

    selectedSeats.get(busId).push({ seatNumber, userId });
    io.to(busId).emit('seatUpdate', { selectedSeats: selectedSeats.get(busId) });
  });

  socket.on('seatDeselected', ({ seatNumber, userId, busId }) => {
    console.log(seatNumber,userId,busId);
    if (selectedSeats.has(busId)) {
      selectedSeats.set(busId, selectedSeats.get(busId).filter(
        (seat) => !(seat.seatNumber === seatNumber && seat.userId === userId)
      ));
      io.to(busId).emit('seatUpdate', { selectedSeats: selectedSeats.get(busId) });
    }
  });

  socket.on('disconnect', (userId) => {
    console.log('User disconnected:', socket.id);

    // Loop through each busId and remove the user's selected seats
    selectedSeats.forEach((seats, busId) => {
      seats.forEach((seat) => {
        console.log(`Current seat: ${seat.seatNumber}, userId (seat): ${seat.userId}`);
      });
      
      // Remove seats selected by the disconnected user
      selectedSeats.set(busId, seats.filter(seat => seat.userId !== u));
      
      io.to(busId).emit('seatUpdate', { selectedSeats: selectedSeats.get(busId) });

      // Decrease viewing users count for this bus
      if (viewingUsers.get(busId)) {
        viewingUsers.set(busId, viewingUsers.get(busId) - 1);
        io.to(busId).emit('viewingUsersUpdate', { viewingUsers: viewingUsers.get(busId) });
      }
    });
  });
});

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});