const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const busSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter the bus name"],
        maxlength: [30, "Name should not exceed 30 characters"],
    },
    driver: {
        name: {
            type: String,
            required: [true, "Please specify the driver's name"],
            trim: true,
        },
        contact: {
            type: String,
            required: [true, "Please specify the driver's contact number"],
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
        },
    },
    busNumber: {
        type: String,
        required: [true, "Please enter the bus number"],
    },
    type: {
        type: String,
        enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
        required: [true, "Please specify the type of bus"],
    },
    features: {
        type: [String],
        default: [],
        required: [true, "Please specify the features of the bus"],
    },
    description: {
        type: String,
        maxlength: [2000, "Description should not exceed 2000 characters"],
    },
    numberOfSeats: {
        type: Number,
        default: 30,
        max: [32, "Total seats cannot exceed 32"],
    },
    seats: [
        {
            seatNumber: {
                type: Number,
                required: true,
                min: 1,
                max: [32, "Seat number cannot exceed 32"],
            },
            isBooked: {
                type: Boolean,
                default: false,
            },
            bookedBy: {
                type: ObjectId,
                ref: "User",
                default: null, // References the User who booked the seat, if any
            },
            bookedAt: {
                type: Date,
                default: null,
            },
        }
    ],
    isAvailable: {
        type: Boolean,
        default: true,
    },
    travel: {
        type: ObjectId,
        ref: "Travel",
        required: [true, "Please specify the travel company"],
    },
    journeyDate: {
        type: Date,
        required: [true, "Please specify the journey date"],
    },
    stoppages: [
        {
            location: {
                type: String,
                required: [true, "Please specify the stoppage location"],
            },
            time: {
                type: Date, // Better for precise time tracking
                required: [true, "Please specify the stoppage time"],
            },
            fare: {
                type: Number, // Add fare for each stoppage
                required: [true, "Please specify the fare for this stoppage"],
            },
        }
    ],
    availableSeats: {
        type: Number,
        default: 0, // Default to zero until calculated
    },
},
    { timestamps: true }
);

// Virtual property to calculate available seats
busSchema.virtual("availableSeatsCalc").get(function () {
    return this.seats.filter(seat => !seat.isBooked).length;
});

// Pre-save hook to initialize seats and calculate available seats
busSchema.pre('save', function (next) {
    // Initialize seats if they are empty
    if (this.seats.length === 0) {
        for (let i = 1; i <= this.numberOfSeats; i++) {
            this.seats.push({
                seatNumber: i,
                isBooked: false,
                bookedBy: null,
                bookedAt: null,
            });
        }
    }

    // Calculate available seats based on unbooked seats
    this.availableSeats = this.seats.filter(seat => !seat.isBooked).length;

    next();
});
busSchema.path('seats').select(false);

module.exports = mongoose.model("Bus", busSchema);
