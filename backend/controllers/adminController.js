const User=require("../models/userModel");
const ErrorHandler =require("../utils/errorhander");
const sendToken=require("../utils/jwtToken");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const FeaturesUtils = require("../utils/featuresUtils");

exports.getTotalRevenue = catchAsyncErrors(async (req, res, next) => {
    try {
        const result = await User.aggregate([
            {
                $group: {
                    _id: null, // Group all users together
                    totalRevenue: { $sum: "$totalSpend" } // Sum the totalSpend field
                }
            }
        ]);

        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0; // Handle no users case

        res.status(200).json({
            success: true,
            totalRevenue,
        });
    } catch (error) {
        next(new ErrorHandler("Failed to calculate total revenue", 500));
    }
});
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(new ErrorHandler("Failed to fetch users", 500));
    }
});
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};