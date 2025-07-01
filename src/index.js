import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB();









/*
import express from "express";
const app = express();

( async () => {
    try {
        mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error:", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Error in connecting to MongoDB:", error);
        throw error;
    }
}) ()

*/