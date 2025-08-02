
import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js"

dotenv.config({
    path: "./env"
})

// Using Promise with .then() and .catch() approach
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`)
            console.log("MongoDB connection is established")
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err)
        process.exit(1)
    })

// Async/await approach (commented out) using try and catch block 
/*
;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error)=>{
            console.log("Error in connecting to MongoDB", error);
            throw error
        })
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`App is listening on port ${process.env.PORT || 8000}`)
            console.log("MongoDB connection is established")
        })
    }
    catch(error){
        console.log("Error in connecting to MongoDB", error)
        process.exit(1)
    }
}) ()
*/