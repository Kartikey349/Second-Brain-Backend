import mongoose, { Mongoose } from "mongoose";

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: {
            values: ["document", "tweet", "youtube", "link"],
            message: `invalid input {VALUE}`
        },
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    tag: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

}, {
    timestamps: true
})


const tagSchema = new mongoose.Schema({
    name: {
        type: String
    }
})



const linkSchema = new mongoose.Schema({
    hash: String,
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})


export const Link = mongoose.model("Link",  linkSchema)
export const Tag = mongoose.model("Tag", tagSchema)
const Content = mongoose.model("Content", contentSchema)

export default Content;