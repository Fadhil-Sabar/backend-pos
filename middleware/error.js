const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // Create Log for dev
  console.error("ERROR DETECTED :", err.name);
  console.error("Causes - ", err.message);

  if(err.code || process.env.NODE_ENV === 'development'){
    console.error("Code - ", err.code);
    console.error(err);
  }

  // Copy Error object
  let customError = { ...err };

  // Get error message
  customError.message = err.message;

  // Joi error middleware
  let errorField;


  // Request Error
  if (err.name === "ReferenceError") {
    const message = `Something went wrong with the server. TODO : please contact the maintainer.`;
    customError = new ErrorResponse(message, 500);
  }

  // SyntaxError on Client JSON
  if (err.name === "SyntaxError") {
    const message = "Failed to take your request, please check your request body / parameter.";
    customError = new ErrorResponse(message, 400);
  }

  // ECONNREFUSED from other Services
  if (err.code === "ECONNREFUSED") {
    let message = "Failed to get response from service";

    if (err.config.url) {
      message += `: ${err.config.url}`;
    }

    customError = new ErrorResponse(message, 400);
  }

  // ERROR METHOD from external Services
  if (err.response) {
    let message = err.response.status ? err.response.statusText : "Failed to get response from External service";
    customError = new ErrorResponse(message, 400);
  }

  //Send JSON response to client
  res.status(customError.statusCode || 500).json({
    code: err.responseCode,
    msg: customError.message || "Server Error",
    data: null,
    errors: err.errors,
    // errorField,
  });
};

module.exports = errorHandler;
