const mongoose = require("mongoose");

// Define an asynchronous function to connect to the MongoDb database
const connectDb = async ()=> {
    try {

        //Attempt to connect to the MongoDB database using provided connection string
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);

        //Log a messsage to indicate succesful connection to database
        console.log("Database connected: ", 
        connect.connection.host,
        connect.connection.name);
    }catch(err){
        //if an error occur during connection, log the error and exit the process
        console.log(err);
        process.exit(1)
    }
};

// EXport the function
module.exports = connectDb;