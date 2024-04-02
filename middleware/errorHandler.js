const  errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    let statusCode = 500;
    let message = "Internal server error"

    //check for specific error type

    if (err.name == "ValidationError"){
        statusCode = 400;
        message = err.message;
    }
    else if (err.name === "MongoError"){
        statusCode = 500;
        message = "Database error";
    }

    else if (err.name === "UnauthorizedError"){
        statusCode = 401;
        message = "Unauthorized access";
    }

    else if (err.name ==="ForbiddenError" || err.message == "User dont have permission to delete other patient profile"){
        statusCode = 403;
        message = "Forbidden access";
    }

    else if (err.name === "Patient not found" ){
        statusCode = 404;
        message = err.message;
    }

    //send the error response
    res.status (statusCode).json({message});
};

module.exports = errorHandler;