const ErrInternalServerError = new Error("Internal Server Error")
const ErrEmailFound = new Error("Email already registered")
const ErrEmailNotFound = new Error("Email not found!")
const ErrInputNull = new Error("Input cannot be empty")
const ErrInvalidInput = new Error("Invalid input")
const ErrPasswordInvalid = new Error("Incorrect password, please check again")

export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype)
    }
}