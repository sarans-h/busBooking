const express=require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { getTotalRevenue, getAllUsers, deleteUser } = require("../controllers/adminController.js");
const router=express.Router();

router.route("/totalrevenue").get(isAuthenticatedUser,getTotalRevenue);
router.route("/allusers").get(isAuthenticatedUser,getAllUsers);
router.route("/user/:id").delete(isAuthenticatedUser, deleteUser);


module.exports=router;