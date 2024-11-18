import mongoose from "mongoose";

const connectDB = async() => {
    const {MONGODB_URI} = process.env;

    try {
        const result = await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected successfully:", result.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export {connectDB}