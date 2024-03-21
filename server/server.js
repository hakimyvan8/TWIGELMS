
import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser"
const morgan =  require("morgan")
require("dotenv").config();


const csrfProtection = csrf({cookie: true});

// Create express instance
const app = express();

//Once you have the connection URL in your env file, you can use the mongoose.connect()
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
}).then(() => console.log("DB connected")) // we then add a promise to check if the connection is successful or not
.catch((err) => console.log("DB connection error", err)); // we also add the catch method to check if there is an error in the connection.


// Apply middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("this is my own middleware")
    next();

});
//we distructure the fs module to specifically use the readdirsync method to read all the files in the routes folder
// auto load all our routes, instead of manually importing the routes. 
// we use the fs module to read all the files in the routes folder and then use the map function to loop through all the files and then use the arrow function to use all the routes in the files.
// we use the app.use method to use all the routes in the files and then we use the /api to prefix all the routes.
//then we use the require method to require all the routes in the files and the we use the backticks to use the routes in the files as API as middleware.
readdirSync("./routes"). map((r) => app.use("/api", require(`./routes/${r}`)));

//csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
    return res.json({csrfToken: req.csrfToken()})
});



//port 
const port = process.env.PORT || 8000;


// start express server
app.listen(port, () => console.log(`server is running on port ${port}`)); 