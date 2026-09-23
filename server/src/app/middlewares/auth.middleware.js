import userModel from "../models/auth.model.js";
import { readAccessToken } from "../utils/auth.utils.js"

export async function verifyJwt(req, res, next) {
    const accessToken = req.headers['authorization'].split(" ")[1]
    if(!accessToken) {
        return res.status(400).json({
            success: false,
            message: "Access token not found in the request header"
        })
    }
    try {
        const decoded = readAccessToken(accessToken);
        const user = await userModel.findById(decoded.userId)
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        })
    }
}

export const isVendor = async (req, res, next) => {
    if(req.user.role !== "seller") {
        return res.status(403).json({
            message: "user is not authorize to create product"
        })
    }
    next()
}