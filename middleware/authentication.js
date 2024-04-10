// import JwT module
const jwt = require ("jsonwebtoken");

// function to authentiacate JWT tokens
const authenticateToken = (req, res, next) => {

    //Extract the authenticaton header from the request
    const authHeader = req.headers["authorization"];

    //Extract the JWT token from the authorization header 
    const token = authHeader && authHeader.split(" ")[1];

    //check if the token is missing
    if (!token){
        //if token is missing, return 401 unauthorized status
        console.log("Access denied, No token");
        res.status(401).json({message: "Access denied. No token provided"});
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        // check for error during validaion
        if (err){
            console.log("Invalid token", err.message);
            return res.status(403).json({message: "Invalid token"});
        }

        // Perform access control check 
        if ((req.method === "DELETE" || req.method === "PUT") && decoded.patientId !== req.params.id){
            return res.status(403).json({message: "Unauthorized access"});
        }

        // store the deoded token data 
        req.user = decoded;
        next();
    });
};

// Exporting the function 

module.exports = authenticateToken;