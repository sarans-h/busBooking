const express=require('express');
const { registerUser, loginUser, logout,myProfile } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
// router.route("/me").get(isAuthenticatedUser,authorizeRoles('traveler'),myProfile);
router.route("/me").get(isAuthenticatedUser,myProfile);


module.exports=router;