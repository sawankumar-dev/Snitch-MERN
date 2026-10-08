import { body, validationResult } from "express-validator";

export const addToCartValidator = [
    body("productId")
        .exists().withMessage("Product id is required").bail()
        .isString().withMessage("Product Id must be a string").bail()
        .isMongoId().withMessage("Product is must be a valid Mongo ID"),
    body("quantity")
        .exists().withMessage("Quantity is required").bail()
        .isInt({min: 1}).withMessage("Quantity must be an integer and greater than 0"),
    body("size")
        .exists().withMessage("Size is required").bail()
        .isString().withMessage("Size must be a string").bail()
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size must be one of XS, S, M, L, XL, XXL"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        next();
    }
]