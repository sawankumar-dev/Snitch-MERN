import { Router } from "express"
import { createProductValidator } from "../validators/product.validator.js"
import { isVendor, verifyJwt } from "../middlewares/auth.middleware.js"
import { uploadProduct } from "../controllers/product.controller.js"
import multer from "multer"

const storage = multer.memoryStorage()

const upload = multer({
    storage, 
    limits: {
        fileSize: 1 * 1024 * 1024, // 1MB limit
        files: 5
    }
})

const router = Router()

router.post(
    "/", 
    verifyJwt, 
    isVendor, 
    upload.array("images", 5), 
    // Secure Parsing Middleware
    (req, res, next) => {
        try {
            // Agar price string aayi hai to use object mein convert karein
            if (req.body?.price && typeof req.body.price === "string") {
                req.body.price = JSON.parse(req.body.price);
            }
            
            // Agar sizes string aayi hai to use array mein convert karein
            if (req.body?.sizes && typeof req.body.sizes === "string") {
                req.body.sizes = JSON.parse(req.body.sizes);
            }
            
            next();
        } catch (error) {
            // Agar JSON format kharab hai to server crash nahi hoga, ye error jayega
            return res.status(400).json({
                success: false,
                message: "Invalid format for price or sizes fields. Must be a valid JSON string."
            });
        }
    }, 
    createProductValidator, 
    uploadProduct
)

export default router
