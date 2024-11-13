const express = require("express");
const Booking = require('../models/bookingModel');
const mongoose = require("mongoose");
const Bus = require('../models/busModel');

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();
// router.route("/tick").get(async(req,res)=>{
//     res.json("ff");
// })
router.route("/m").post(isAuthenticatedUser, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { seatUpdates, userId, busId } = req.body;

        if (!Array.isArray(seatUpdates) || seatUpdates.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'seatUpdates array is required.' });
        }

        const seatIds = seatUpdates.map(su => su.seatId); // Get seatIds from the seatUpdates
        console.log(`Booking seats for busId: ${busId}`);
        console.log(`Requested seat IDs: ${seatIds}`);

        // Fetch the bus with the specified busId
        const bus = await Bus.findOne({ _id: busId }).select("+seats").session(session);

        if (!bus) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: 'Bus not found.' });
        }

        // Check if requested seats are available
        const availableSeats = bus.seats.filter(seat => 
            seatIds.includes(seat._id.toString()) && !seat.isBooked
        );

        console.log(`Available seats to book: ${availableSeats.length}`);
        
        // If the number of available seats doesn't match the request, abort
        if (availableSeats.length !== seatUpdates.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'One or more seats are already booked or unavailable.' });
        }

        // Step 2: Book all seats by updating the seats array directly
        for (const seatUpdate of seatUpdates) {
            const { seatId, bookedBy } = seatUpdate;
            console.log(`Attempting to book seatId: ${seatId} for userId: ${bookedBy}`);

            // Find the seat in the bus document
            const seat = bus.seats.find(s => s._id.toString() === seatId);

            if (seat && !seat.isBooked) {
                // Book the seat
                seat.bookedBy = bookedBy;
                seat.isBooked = true;

                console.log(`Seat with seatId ${seatId} successfully booked by ${bookedBy}`);
            } else {
                console.log(`Failed to book seatId: ${seatId}, it might already be booked.`);
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ msg: `Seat with id ${seatId} could not be booked. It might already be booked.` });
            }
        }

        // Save the updated bus document
        await bus.save({ session });

        // Step 3: Create a booking entry after all seats are successfully booked
        const bookedSeatIds = seatUpdates.map(su => su.seatId);

        const newBooking = new Booking({
            userId,
            busId,
            seats: bookedSeatIds,
            status: 'booked'
        });

        await newBooking.save({ session }); // Save the booking in the same transaction

        // Step 4: Commit the transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        console.log(`Seats booked successfully for busId: ${busId}`);
        console.log('z'+newBooking._id);
        return res.status(200).json({ msg: 'Seats booked and booking entry created successfully.',bookingId: newBooking._id });

    } catch (err) {
        // Roll back the transaction in case of any error
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ msg: 'Server Error' });
    }
});
router.route("/tick/:bookingId").get(async (req, res) => {
    try {
      // Find the booking without population first
      const booking = await Booking.findById(req.params.bookingId).populate('busId', 'name busNumber seats');
  
      if (!booking) return res.status(404).send("Booking not found");
  
      const bookedSeatIds = booking.seats.map(seat => seat.toString());
      const filteredSeats = booking.busId.seats
      .filter(seat => bookedSeatIds.includes(seat._id.toString()))
      .map(seat => ({
        seatNumber: seat.seatNumber,
        isBooked: seat.isBooked,
        bookedBy: seat.bookedBy,
        bookedAt: seat.bookedAt
      }));
      const response = {
        _id: booking._id,
        userId: booking.userId,
        bus: {
          name: booking.busId.name,
          busNumber: booking.busId.busNumber,
          seats: filteredSeats // Only booked seats are included here
        },
        bookingTime: booking.bookingTime,
        status: booking.status
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });                   

  
module.exports = router; 