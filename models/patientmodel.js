const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Define the patient schema
const patientSchema = new mongoose.Schema({
    //first name is required
    firstName: {
        type: String,
        required: [true, "Pls give your first name"]
    },
    //last name is required
    lastName: {
        type: String,
        required: [true, "Pls give your last name"]
    },
    //email is required
    email: {
        type:String,
        required: [true, "pls give your email adress"]
    },

    //password is required
    password: {
        type: String,
        required: [true, "Pls enter your password"]
    },

    //Phone Number is required
    phoneNumber: {
        type: String,
        required: [true, "Please enter your phone number "]
    },

    //Address is required
    address: {
        type: String,
        required: [true, "Pls enter your adress"]
    },

//Give time stamp for the operation
},{timestamps: true});

//Hash password before saving
patientSchema.pre("save", async function (next){
    if (!this.isModified("password")){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        // replace the plaintext password with the hashed one
        
        next();
    }
    catch (error){ 
        next (error)
    }
    
})

module.exports = mongoose.model("patient", patientSchema);