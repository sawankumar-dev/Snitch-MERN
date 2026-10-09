import { body, validationResult, param } from "express-validator";

export const createProductValidator = [
  // 1. Title Validation
  body("title")
    .exists().withMessage("Title is required").bail()
    .isString().withMessage("Title must be a string").bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Title length must be between 2 to 100").bail()
    // Agar product title mein numbers aur spaces dono allow karne hain (e.g., "T Shirt 123")
    .isAlphanumeric("en-US", { ignore: " " }).withMessage("Title can only contain letters, numbers, and spaces"),

  // 2. Description Validation
  body("description")
    .exists().withMessage("Description is required").bail()
    .isString().withMessage("Description must be a String").bail()
    .trim()
    // Yahan aakhiri mein `.bail()` ke brackets () jo chhut gaye the, unhe thik kar diya hai
    .isLength({ min: 20, max: 500 }).withMessage("Description length must be between 20 to 500 characters").bail(),

  // 3. Price Amount Validation
  body("price.amount")
    .exists().withMessage("Price amount is required").bail()
    // `{ min: 0 }` ko badal kar `{ gt: 0 }` kar diya hai kyunki price 0 se bada hona chahiye
    .isFloat({ gt: 0 }).withMessage("Price amount must be a floating number and must be greater than 0"),

  // 4. Price Currency Validation
  body("price.currency")
    .exists().withMessage("Currency is required").bail()
    .isString().withMessage("Currency must be a string").bail()
    .isIn(["INR", "USD"]).withMessage("Currency must either be INR or USD"),

  // 5. Sizes Array Validation
  body("sizes")
    .exists().withMessage("Sizes are required").bail()
    .isArray({ min: 1 }).withMessage("Sizes must be a non-empty array"),

  // 6. Sizes Object inside Array Validation
  body("sizes.*.size")
    .exists().withMessage("Size must be present in every entry of sizes array.").bail()
    .isString().withMessage("Size must be a string").bail() // Trim se pehle string check zaroori hai
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size can be one of these: XS, S, M, L, XL, XXL"),

  body("sizes.*.stock")
    .exists().withMessage("Stock must be present in every entry of the sizes array").bail()
    .isInt({ min: 0 }).withMessage("Stock must be a positive integer value"),

  // 7. Error Handling Middleware
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: errors.array(),
      });
    }
    next();
  },
];

export const unlistProductValidator = [
  param("id")
    .exists().withMessage("Product id is required in req params").bail()
    .isMongoId().withMessage("Product id must be a valid mongo object id"),
  (req, res, next) => {
    const result = validationResult(req.body)
    if(!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message:"Invalid data",
        errors: result.array()
      })
    }
    next()
  }
]
export const listProductValidator = [
  param("id")
    .exists().withMessage("Product id is required in req params").bail()
    .isMongoId().withMessage("Product id must be a valid mongo object id"),
  (req, res, next) => {
    const result = validationResult(req.body)
    if(!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message:"Invalid data",
        errors: result.array()
      })
    }
    next()
  }
]