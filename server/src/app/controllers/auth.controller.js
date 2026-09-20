import userModel from "../models/auth.model.js";
import bcrypt from "bcryptjs"
import { createAccessToken, createRefreshToken, readRefreshToken } from "../utils/auth.utils.js";

/**
 * @description Register an user and save the data from req.body
 * @param req Express.Request
 * @param req.body Object
 * @param req.body.name String
 * @param req.body.email String
 * @param req.body.password String
 */
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email: email })
    if(userExists) {
        return res.status(409).json({
            success: false,
            errors: [
                {
                    field: "email",
                    message: "User already exists with this email address"
                }
            ]
        })
    }
    const user = await userModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 12)
    })
    const accessToken = createAccessToken({ userId: user._id, role: user.role })
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })
    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
    })
    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken
        }
    })
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if(!user) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        })
    }
    const isPasswordRight = await bcrypt.compare(password, user.password)
    if(!isPasswordRight) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        })
    }
    const accessToken = createAccessToken({ userId: user._id, role: user.role })
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })
    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
    })
    res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken
        }
    })    
}

export async function  refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh Token is required."
        })
    }
    try {
        const { userId, role } = readRefreshToken(refreshToken)
        const user = await userModel.findById(userId);
        if(user.refreshToken !== refreshToken) {
            await userModel.findByIdAndUpdate(user._id, {
                refreshToken: null,
            })
            return res.status(401).json({
                success: false,
                message: "Refresh Token mismatch"
            })
        }
        const accessToken = createAccessToken({
            userId,
            role
        })
        const newRefreshToken = createRefreshToken({
            userId,
            role,
        })
        await userModel.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        })
        res.status(200).json({
            success: true,
            message: "Tokens updated successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            }
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        })
    }
}

export async function  getMe(req, res) {
    const user = req.user
    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully!",
        data: {
            user
        }
    })
}