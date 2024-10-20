const express = require("express");
const { addBus, getAllBuses, editBus, deleteBus, getSingleBus } = require("../controllers/busController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/add").post(isAuthenticatedUser,authorizeRoles('travel'),addBus);
router.route("/buses").get(getAllBuses);
router.route("/getSingle/:busId").get(getSingleBus);
router.route("/update/:busId").put(isAuthenticatedUser,authorizeRoles('travel'),editBus);
router.route("/delete/:busId").delete(isAuthenticatedUser, authorizeRoles('travel'), deleteBus);

module.exports=router;