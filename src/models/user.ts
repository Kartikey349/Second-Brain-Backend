import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        minLength: 3
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    }
})

const User = mongoose.model("User", userSchema)

export default User;