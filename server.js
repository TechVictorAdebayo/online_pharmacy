const express = require('express'); //ImportExpress framework
const dotenv = require ("dotenv").config(); //Load environment variables
const errorHandler = require ("./middleware/errorHandler"); //Error Handler
const connectDb = require("./config/mongodbConfig"); // Import function to connect to MongoDb database
connectDb(); //connect to mongoDB database


// Create an instance of Express application
const app = express();

//middleware to parse incoming JSON
app.use(express.json());

//set port
const port = process.env.PORT || 5000;

//Route configuration 
app.use("/api/patients", require("./routes/patientroute"));

//Apply error handling middleware
app.use(errorHandler);


//Define the port number for the server to listen on
app.listen(port, () => {
    //Log a message to indicate the server is running and listening on the specified port
    console.log (`Server is running on port ${port}`);
});