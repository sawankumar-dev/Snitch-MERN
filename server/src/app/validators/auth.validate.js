import { body, validationResult } from "express-validator"

export const registerValidator = [
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string")
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Name length must be between 2 to 50 characters"),
    body('email')
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter Valid Email address"),
    body('password')
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a String")
        .trim()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 character long"),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request",
                errors: errors.array()
            })
        }
        next()
    }
]

export const loginValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a String Value").bail()
        .trim()
        .isEmail().withMessage("Enter a valid Email address"),
    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be an String value")
        .trim()
        .isLength({min: 6}).withMessage("Password must be at least 6 character long"),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty) {
            return res.status(400).json({
                success: false,
                message: "Invalid data",
                errors: errors.array()
            })
        }
        next()
    }
]