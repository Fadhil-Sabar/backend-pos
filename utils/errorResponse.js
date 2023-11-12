class ErrorResponse extends Error {
	constructor(message, statusCode, responseCode = '0', errors = []) {
		super(message);
		this.statusCode = statusCode;
		this.responseCode = responseCode;
		this.errors = errors;
	}
}
module.exports = ErrorResponse;