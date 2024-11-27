const express=require("express");
const app=express();
const cors = require("cors"); // Import cors
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload");
const cookieParser=require('cookie-parser');
const dotenv = require('dotenv');
const errorMiddleware=require("./middleware/error")
const Booking = require('./models/bookingModel');
const mongoose = require("mongoose");

const Bus = require('./models/busModel');

dotenv.config({path:'./config/config.env'});
app.use(cors(({
        origin: "https://bus-booking-alpha.vercel.app", // Frontend domain
        credentials: true, // Allow credentials (cookies)
    }));
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

const auth=require("./routes/authRoute");
const bus=require("./routes/busRoutes");
const book=require("./routes/bookingRoute");
const admin=require('./routes/adminRoutes')
app.use("/api/v1/auth",auth);
app.use("/api/v1/bus",bus);
app.use("/api/v1/book",book);
app.use("/api/v1/admin",admin);

app.get('/fetchseats/:bId', async (req, res) => {
    const { bId } = req.params; // Extract busId (bId) from the request params
    // console.log(bId)
    try {
      // Fetch seats for the given busId
      const seatsData = await Bus.findOne({ _id: bId }).select("+seats");
    //   console.log(seatsData.seats)
      if (!seatsData) {
        return res.status(404).json({ msg: 'No seats found for the provided bus ID.' });
      }
      
      res.status(200).json({ seats: seatsData.seats }); // Send the seats array to the client
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  });

 
//   app.post('/book',
//      async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { seatUpdates, userId, busId } = req.body;

//         if (!Array.isArray(seatUpdates) || seatUpdates.length === 0) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).json({ msg: 'seatUpdates array is required.' });
//         }

//         const seatIds = seatUpdates.map(su => su.seatId); // Get seatIds from the seatUpdates
//         console.log(`Booking seats for busId: ${busId}`);
//         console.log(`Requested seat IDs: ${seatIds}`);

//         // Fetch the bus with the specified busId
//         const bus = await Bus.findOne({ _id: busId }).select("+seats").session(session);

//         if (!bus) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(404).json({ msg: 'Bus not found.' });
//         }

//         // Check if requested seats are available
//         const availableSeats = bus.seats.filter(seat => 
//             seatIds.includes(seat._id.toString()) && !seat.isBooked
//         );

//         console.log(`Available seats to book: ${availableSeats.length}`);
        
//         // If the number of available seats doesn't match the request, abort
//         if (availableSeats.length !== seatUpdates.length) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).json({ msg: 'One or more seats are already booked or unavailable.' });
//         }

//         // Step 2: Book all seats by updating the seats array directly
//         for (const seatUpdate of seatUpdates) {
//             const { seatId, bookedBy } = seatUpdate;
//             console.log(`Attempting to book seatId: ${seatId} for userId: ${bookedBy}`);

//             // Find the seat in the bus document
//             const seat = bus.seats.find(s => s._id.toString() === seatId);

//             if (seat && !seat.isBooked) {
//                 // Book the seat
//                 seat.bookedBy = bookedBy;
//                 seat.isBooked = true;

//                 console.log(`Seat with seatId ${seatId} successfully booked by ${bookedBy}`);
//             } else {
//                 console.log(`Failed to book seatId: ${seatId}, it might already be booked.`);
//                 await session.abortTransaction();
//                 session.endSession();
//                 return res.status(400).json({ msg: `Seat with id ${seatId} could not be booked. It might already be booked.` });
//             }
//         }

//         // Save the updated bus document
//         await bus.save({ session });

//         // Step 3: Create a booking entry after all seats are successfully booked
//         const bookedSeatIds = seatUpdates.map(su => su.seatId);

//         const newBooking = new Booking({
//             userId,
//             seats: bookedSeatIds,
//             status: 'booked'
//         });

//         await newBooking.save({ session }); // Save the booking in the same transaction

//         // Step 4: Commit the transaction if everything is successful
//         await session.commitTransaction();
//         session.endSession();

//         console.log(`Seats booked successfully for busId: ${busId}`);
//         return res.status(200).json({ msg: 'Seats booked and booking entry created successfully.' });

//     } catch (err) {
//         // Roll back the transaction in case of any error
//         await session.abortTransaction();
//         session.endSession();
//         console.error(err);
//         return res.status(500).json({ msg: 'Server Error' });
//     }
// });







app.use(errorMiddleware);
module.exports=app;
