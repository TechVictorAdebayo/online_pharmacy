const asyncHandler = require ("express-async-handler");
const bcrypt = require("bcrypt");
const Patient = require ("../models/patientmodel");
const patientmodel = require("../models/patientmodel");
const jwt = require ("jsonwebtoken");

//@desc Register  new patient
//@route  POST /api/patients/register
//acess public

const registerPatient = asyncHandler(async (req,res) => {
    const {firstName, lastName,email, password, phoneNumber, address} = req.body;

    //Ensure that all the required fiels are supplied
    if (!firstName || !lastName || !email || !password || !phoneNumber || !address){
        res.status(400).json({error: "All fields are mandatory"});
        return;
    }

    //Ensure that no mutiple registration from the same email
    const existingPatient = await Patient.findOne({email});
    if (existingPatient){
        res.status(400).json({message: "Patient already exists with this email"});
    }

    //Hash password
    

    //Go ahead to register the patient
    
    const patient = await Patient.create ({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
    });
    res.status(201).json({message: "Patient registered succesfully", patient: patient});
    
    
});

//@desc login patient
//@route POST /api/patients/login
//access public

const loginPatient = asyncHandler (async (req, res) =>{
    const {email, password} = req.body;

    //check if Patient is registered
    const patient = await Patient.findOne({email});

    //if patient is not registered, tell the patient to register
    if (!patient){
        return res.status(400).json({message: "Patient not found. Please register first"});
        
    }
    // compare hashed password 
    // Compare hashed password from database with hashed password from request body
    

    console.log(password);
    console.log(patient.password);
    const passwordMatch = await bcrypt.compare(password, patient.password);
    console.log(passwordMatch);

    
    
    if (passwordMatch){
        //Token for validation
        const token = jwt.sign({ patientId:patient._id },
        process.env.JWT_SECRET,
        {expiresIn: '1h'});


        //Login the patient
        res.status(200).json({message: "Login Succesful", token: token});

    }

    else {
        return res.status(401).json({message: "Invalid email or password"})
    }
         
});
//@desc Get patient by ID
//@route GET /api/patients/:id
//@access public

const getPatientById = asyncHandler (async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    // If patient exist, give the patient details
    if (patient){
        res.json(patient);

    //If patiet does not exit, let us know
    }else{
        res.status(404).json({message: "patient not found"});
    }
});

//@desc Update patient profile
//@route POST/api/patients/:id
//@access private
const updatePatient = asyncHandler(async (req, res) => {
    const patientId = req.params.id;

    //verify token
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.patientId !== patientId){
            throw new Error("Unauthorized access");
        }
    } catch (err){
        return res.status(401).json({message: "Unauthorized access"})
    }

    // Find patient by ID

    const patient = await Patient.findById(patientId);

    if (!patient) {
        return res.status(400).json({message: "Patient not found"});
    }

    //Extract field from request body

    const{firstName, lastName, phoneNumber, address} = req.body;

    //Update patient fields based on provided data
    if (firstName){
        patient.firstName = firstName;
    }

    if (lastName){
        patient.lastName = lastName;
    }

    if (phoneNumber){
        patient.phoneNumber = phoneNumber;
    }

    if (address){
        patient.address = address;
    }

    //save the updated patient profile
    await patient.save();

    res.status(200).json({message: "Patient profile updated succesfully", patient})
}
);
   
//@desc Delete a patient profile
//@route DELETE /api/patients/:id
//@access private

const deletePatient = asyncHandler (async (req, res) => {
    
    
    try {
        //verify token
        const  token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Ensure user has permission to delete the patient profile
        if (decoded.patientId !== req.params.id){
            throw new Error ("User dont have permission to delete other patient profile");
        }

        //find patient by id
    const patient = await Patient.findById(req.params.id);

    
    if(!patient){
        res.status(404).json({message: "Patient not found"});
        
    }
    // Delete  patient profile

    await Patient.findByIdAndDelete(req.params.id);

    //Send a succes message 
    res.status(200).json({message: "Patient profile deleted succesfully"});
    } catch (err){
        //Handle authentication errors
        res.status(401).json({message: "Unauthorized access"});

    }

 
});


module.exports = { registerPatient, loginPatient, getPatientById, updatePatient, deletePatient };
