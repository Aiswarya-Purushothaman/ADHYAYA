import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectMongoDB = await mongoose.connect(
      "mongodb://127.0.0.1:27017/ADHYAYA"
    );

    console.log(
      `Mongo DB connected successfully: ${connectMongoDB.connection.host}`
    );
  } catch (error: any) {
    console.error(`Error connecting to Mongo DB: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };
