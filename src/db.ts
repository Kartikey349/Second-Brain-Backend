import mongoose from "mongoose"

const connectDb = async () => {
    const URI = process.env.MONGO_URI

    await mongoose.connect(URI as string);
}

export default connectDb;