const express=require("express");
const app=express();
const cors = require("cors"); // Import cors
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload");
const cookieParser=require('cookie-parser');
const dotenv = require('dotenv');
const errorMiddleware=require("./middleware/error")


dotenv.config({path:'./config/config.env'});
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

const auth=require("./routes/authRoute");
const bus=require("./routes/busRoutes");
app.use("/api/v1/auth",auth);
app.use("/api/v1/bus",bus);



app.use(errorMiddleware);
module.exports=app;