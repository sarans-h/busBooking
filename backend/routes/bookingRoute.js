const express = require("express");
const Booking = require('../models/bookingModel');
const mongoose = require("mongoose");
const Bus = require('../models/busModel');
const User = require('../models/userModel');

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();
// router.route("/tick").get(async(req,res)=>{
//     res.json("ff");
// })
const calculateTotalFareByTravelId = async (travelId) => {
    try {
      // Fetch bookings with populated bus details
      const bookings = await Booking.find()
        .populate({
          path: 'busId',
          match: { travel: travelId }, // Only include buses where travel matches travelId
        })
        .exec();
  
      // Filter bookings where busId is not null after population (travel matched)
      const filteredBookings = bookings.filter(booking => booking.busId !== null);
  
      // Calculate total fare
      const totalFare = filteredBookings.reduce((sum, booking) => sum + booking.fare, 0);
  
      return totalFare;
    } catch (error) {
      console.error('Error calculating total fare:', error);
      throw error; // Propagate the error to handle it further up
    }
  }; 
router.route("/m").post(isAuthenticatedUser, async (req, res) => {
    const session = await mongoose.startSession();
    const getTotalFare =async (busId, fromLocation, toLocation) => {
        try {
            const bus = await Bus.findOne(
                {
                    _id: busId,
                    "stoppages.location": { $all: [fromLocation, toLocation] }, // Ensure both locations exist
                },
                { stoppages: 1, _id: 0 } // Project only the stoppages field
            );
            if (!bus) {
                return { error: "Bus not found or locations do not exist in stoppages" };
            }
    
            // Find the fares for both locations
            const fares = bus.stoppages
                .filter(stoppage => [fromLocation, toLocation].includes(stoppage.location))
                .map(stoppage => ({ location: stoppage.location, fare: stoppage.fare }));
    
            // Ensure both locations are found
            if (fares.length !== 2) {
                return { error: "One or both locations not found in stoppages" };
            }
    
            // Extract the fares for fromLocation and toLocation
            const fromFare = fares.find(stoppage => stoppage.location === fromLocation).fare;
            const toFare = fares.find(stoppage => stoppage.location === toLocation).fare;
            
            
            // Calculate the fare difference
            const fareDifference = toFare - fromFare;
            console.log(fareDifference);
            return  fareDifference ;
        } catch (error) {
            console.error("Error fetching fares:", error.message);
            return { error: error.message };
        }
    };
    
    session.startTransaction();
    async function getStoppages(busId) {
        try {
            const bus = await Bus.findOne(
                { _id: busId }, // Match the bus by ID
                { stoppages: 1, _id: 0 } // Project only the stoppages field
            );
    
            if (!bus) {
                return { error: "Bus not found" };
            }
    
            return bus.stoppages;
        } catch (error) {
            console.error("Error fetching stoppages:", error.message);
            return { error: error.message };
        }
    }
    try {
        const { seatUpdates, userId, busId, fromStop, toStop, journeyDate} = req.body;

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
        bus.availableSeats -= seatUpdates.length;

      if (bus.availableSeats < 0) {
      console.error('Error: availableSeats count is negative.');
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ msg: 'Error updating available seats. ' });
      } 

        // Save the updated bus document
        await bus.save({ session });

        // Step 3: Create a booking entry after all seats are successfully booked
        const bookedSeatIds = seatUpdates.map(su => su.seatId);
        const sa= await getTotalFare(busId,fromStop,toStop);
        const fare=sa*seatUpdates.length;
        console.log(fare);
        console.log(`Type of fare: ${typeof fare}`)

        const newBooking = new Booking({
            userId,
            busId,
            seats: bookedSeatIds,
            status: 'booked',
            from:fromStop,
            to:toStop,
            fare,
            journeyDate
        });

        await newBooking.save({ session }); // Save the booking in the same transaction
        const user = await User.findById(req.user._id).session(session); // Use the logged-in user's ID
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: 'User not found.' });
        }

        user.myBooking.push(newBooking._id); // Add the new booking ID to myBooking
        await user.save({ session }); 
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
router.route("/revenue").get(isAuthenticatedUser,async (req, res) => {
    const travelId = req.user.id; // Assuming travelId is passed as a query parameter
  
    if (!travelId) {
      return res.status(400).json({ error: 'Travel ID is required' });
    }
  
    try {
      const totalRevenue = await calculateTotalFareByTravelId(travelId);
      res.status(200).json({ travelId, totalRevenue });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate revenue', details: error.message });
    }
  });               

  
module.exports = router; 