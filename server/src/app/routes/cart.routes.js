import { Router } from "express"
import { isVendor, verifyJwt } from "../middlewares/auth.middleware.js";
import { addToCartValidator } from "../validators/cart.validate.js";
import { addCart, getCart } from "../controllers/cart.controller.js";

const router = Router()

router.post("/", verifyJwt, addToCartValidator , addCart) 
router.get("/", verifyJwt, getCart)

export default router;