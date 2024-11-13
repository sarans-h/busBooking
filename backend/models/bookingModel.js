const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema({
  userId: {
    type: String, // Reference to user for now, can later be a reference to a User model
    required: true
  },
  busId: {
    type: ObjectId, // Reference to the Bus the booking is associated with
    ref: 'Bus',
    required: true
  },
  seats: [{
    type: ObjectId, // Store seat numbers directly for simplicity
    required: true
  }],
  bookingTime: {
    type: Date,
    default: Date.now, // Automatically records booking time
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'canceled', 'completed'],
    default: 'booked'
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
