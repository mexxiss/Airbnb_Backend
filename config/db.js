import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGODB_URI, DB_URI } = process.env;

  try {
    const result = await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully:", result.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDB };
