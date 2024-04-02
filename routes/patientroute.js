const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const authenticateToken = require("../middleware/authentication");

const{
    registerPatient, 
    loginPatient, 
    deletePatient,
    updatePatient,
    getPatientById
} = require ("../controllers/patientcontroller");




const { errorHandler } = require ("../middleware/errorHandler");
//Register a new patient
router.post("/register", asyncHandler(registerPatient)  );

// Login a registered pattient

router.post("/login", asyncHandler(loginPatient) );

//Get patient by ID
router.get("/:id",  asyncHandler(getPatientById));

//update patient by ID
router.put("/:id",authenticateToken, asyncHandler(updatePatient));

//Delete patient by authentication
router.use(authenticateToken)
router.delete("/:id", authenticateToken, asyncHandler(deletePatient));

module.exports = router;