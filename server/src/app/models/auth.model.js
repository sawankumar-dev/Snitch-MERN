import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "seller"]
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true })

const userModel = mongoose.model("User", userSchema)
export default userModel;