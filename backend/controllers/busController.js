const Bus=require("../models/busModel");
const ErrorHandler =require("../utils/errorhander");
const sendToken=require("../utils/jwtToken");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const FeaturesUtils = require("../utils/featuresUtils");

// add bus
exports.addBus = catchAsyncErrors(async (req, res, next) => {
    // 1. Data Extraction
    console.log(req.body);
    const {
        name,
        driverName,
        driverContact,
        busNumber,
        type,
        description,
        numberOfSeats,
        journeyDate,
        startTime
    } = req.body;
    const travel = req.user._id;
    // console.log(req.body);
    
    // Parse stoppages from formData
    const stoppages = [];
    Object.keys(req.body).forEach((key) => {
        const match = key.match(/^stoppages\[(\d+)\]\[(\w+)\]$/);
        if (match) {
            const index = match[1];
            const field = match[2];

            if (!stoppages[index]) {
                stoppages[index] = {};
            }

            if (field === 'location') {
                stoppages[index].location = req.body[key];
            } else if (field === 'time') {
                stoppages[index].time = new Date(req.body[key]); // Convert time to Date object
            } else if (field === 'fare') {
                stoppages[index].fare = Number(req.body[key]); // Convert fare to Number
            }
        }
    });
    const features=[];
    Object.keys(req.body).forEach((key) => {
        const match = key.match(/^features\[(\d+)\]$/);
        if (match) {
            const index = match[1];
            features[index] = req.body[key];
        }
    });
    // Validations
    if (!name) {
        return next(new ErrorHandler('Bus name is required', 400));
    }
    if (!driverName || !driverContact) {
        return next(new ErrorHandler('Driver details are required', 400));
    }
    if (!busNumber) {
        return next(new ErrorHandler('Bus number is required', 400));
    }
    if (!type) {
        return next(new ErrorHandler('Bus type is required', 400));
    }
    if (!numberOfSeats) {
        return next(new ErrorHandler('Number of seats is required', 400));
    }
    if (!travel) {
        return next(new ErrorHandler('Travel information is required', 400));
    }
    if (!journeyDate) {
        return next(new ErrorHandler('Journey date is required', 400));
    }
    if (!stoppages || stoppages.length === 0) {
        return next(new ErrorHandler('Stoppages information is required', 400));
    }

    // Driver details as an object
    const driver = {
        name: driverName,
        contact: driverContact
    };

    // Create the bus entry
    const bus = await Bus.create({
        name,
        driver,
        busNumber,
        type,
        features,
        description,
        numberOfSeats,
        travel,
        journeyDate,
        stoppages,
        startTime,
        ownerId:req.user.id
    });

    // Respond with success message
    res.status(201).json({
        success: true,
        message: 'Bus added successfully',
        bus
    });
});

// get all buses
exports.getAllBuses = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage=4;
    let busCount=await Bus.countDocuments();

    let apiFeatures=new FeaturesUtils(Bus.find(),req.query).search().filter().filterByStoppagesAndDate();
    
    const totalBuses = await apiFeatures.query.clone().countDocuments();

    // 3. Now apply pagination to the same query
    apiFeatures.pagination(resultPerPage);
    const buses = await apiFeatures.query;

    res.status(200).json({
        success: true,
        message: 'All buses retrieved successfully',
        buses,
        totalBuses,
    });

})
// edit bus
exports.editBus = catchAsyncErrors(async (req, res, next) => {
    
    let bus = await Bus.findById(req.params.busId);
    if (!bus) {
        return next(new ErrorHandler('Bus not found', 404));
    }
     // Check if the authenticated user is the one who created the bus
     if (bus.travel.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to update this bus', 403));
    }
    const {
        name,
        driver,
        busNumber,
        type,
        features,
        description,
        numberOfSeats,
        travel,
        journeyDate,
        stoppages,
        startTime,
        isAvailable
    } = req.body;

    bus.name = name || bus.name;
    bus.driver = driver || bus.driver;
    bus.busNumber = busNumber || bus.busNumber;
    bus.type = type || bus.type;
    bus.features = features || bus.features;
    bus.description = description || bus.description;
    bus.numberOfSeats = numberOfSeats || bus.numberOfSeats;
    bus.travel = travel || bus.travel;
    bus.journeyDate = journeyDate || bus.journeyDate;
    bus.stoppages = stoppages || bus.stoppages;
    bus.startTime = startTime || bus.startTime;
    bus.isAvailable = isAvailable !== undefined ? isAvailable : bus.isAvailable;

    const updatedBus = await bus.save();

    res.status(200).json({
        success: true,
        message: 'Bus updated successfully',
        bus: updatedBus
    });
});
// delete bus
exports.deleteBus = catchAsyncErrors(async (req, res, next) => {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) {
        return next(new ErrorHandler('Bus not found', 404));
    }

    // Check if the authenticated user is the one who created the bus
    if (bus.travel.toString() !== req.user.id) {
        return next(new ErrorHandler('You are not authorized to delete this bus', 403));
    }

    
    await Bus.deleteOne({ _id: req.params.busId });

    res.status(200).json({
        success: true,
        message: 'Bus deleted successfully'
    });
});
// get single bus
exports.getSingleBus = catchAsyncErrors(async (req, res, next) => {
    const bus = await Bus.findById(req.params.busId).select("+seats");
    if (!bus) {
        return next(new ErrorHandler('Bus not found', 404));
    }
    res.status(200).json({
        success: true,
        bus: bus

    });
})
// seed
exports.seedBuses = async (req, res) => {
    try {
        // Clear existing buses
        await Bus.deleteMany({});

        for (let i = 1; i <= 100; i++) {
            const journ= new Date();
            journ.setDate(journ.getDate() + i);
            const bus = new Bus({
                name: `Bus ${i}`,
                driver: {
                    name: `Driver ${i}`,
                    contact: `1234567890`,
                },
                busNumber: `BUS${i}`,
                type: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'][i % 4],
                features: ["Wi-Fi", "Charging Ports", "Reclining Seats"],
                description: `This is a description for Bus ${i}.`,
                numberOfSeats: 30 + (i % 3),
                travel: req.user._id,
                journeyDate: journ,
                stoppages: [
                    {
                        location: `Stop ${i}-A`,
                        time: new Date(),
                        fare: 50 + (i * 2),
                    },
                    {
                        location: `Stop ${i}-B`,
                        time: new Date(),
                        fare: 100 + (i * 2),
                    },
                    {
                        location: `Stop ${i}-C`,
                        time: new Date(),
                        fare: 50 + (i * 2),
                    },
                    {
                        location: `Stop ${i}-D`,
                        time: new Date(),
                        fare: 100 + (i * 2),
                    },
                ],
            });

            await bus.save(); // This will trigger the pre-save hook and initialize seats
        }

        res.status(201).json({ success: true, message: "Seeded 100 buses successfully!" });
    } catch (error) {
        console.error("Seeding error:", error);
        res.status(500).json({ success: false, message: "Failed to seed buses." });
    }
};
// getmyBuses for travel
exports.getMyBuses = catchAsyncErrors(async (req,res,next)=>{
    const buses = (await Bus.find({travel:req.user._id}).select("+seats"));
    res.status(200).json({success:true,data:buses});
    
})
