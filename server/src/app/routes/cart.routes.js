import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToCartValidator } from "../validators/cart.validate.js";
import { addCart } from "../controllers/cart.controller.js";

const router = Router()

router.post("/", verifyJwt, addToCartValidator , addCart) 
router.get("/", verifyJwt, )

export default router;