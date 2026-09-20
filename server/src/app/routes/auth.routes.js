import { Router } from 'express';
import { loginValidator, registerValidator } from '../validators/auth.validate.js';
import { getMe, loginUser, refresh, registerUser } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router()

/**
 * @POST /api/auth/register
 * @param req Express req
 * @param req.body = { email, name, password }
 * @response res.status = 200 (if successful)
 */
router.post("/register", registerValidator, registerUser) // ✅ Done
router.post("/login", loginValidator, loginUser)          // ✅ Done
router.post("/refresh", refresh)                          // ✅ Done
router.get("/me",verifyJwt, getMe)

export default router;