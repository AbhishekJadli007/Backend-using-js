import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected successfully to host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1)
    }
}

export default connectDB


/// Code Breakdown (Hinglish):

// import mongoose from "mongoose"
// import { DB_NAME } from "../constants.js"
// Yaha mongoose ko import kiya gaya hai jo MongoDB ke sath kaam karne ke liye use hota hai.

// DB_NAME ( defined in constants.js ) ek constant hai jisme database ka naam store hoga.

// const connectDB = async () => {
// Ye ek async function hai jiska naam connectDB hai.

// Is function ka kaam hai MongoDB ke sath connection banana.


// try {
//     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// Try block me hum MongoDB ke sath connect karne ki koshish kar rahe hain.

// mongoose.connect() ke andar connection string hai jo .env file se MONGODB_URI uthata hai aur uske aage DB_NAME lagata hai.

// await ka use kiya gaya hai, matlab jab tak connection nahi banta tab tak function wait karega.

// console.log(`MongoDB connected successfully to host: ${connectionInstance.connection.host}`)
// Agar connection successful ho gaya to console me message print hoga jisme bataya jayega ki MongoDB kis host se connected hai.

// } catch (error) {
//     console.log("MongoDB connection error", error)
//     process.exit(1)
// }
// Agar koi error aata hai to catch block me us error ko console me print kiya jayega.

// process.exit(1) ka matlab hai app ko turant band kar dena because DB connection fail ho gaya.


// export default connectDB
// Is line se connectDB function ko export kiya gaya hai taki isse dusri files me use kiya ja sake.



// Why is / used here?

// Jab hum MongoDB Atlas se connect karte hain, connection URI ka format kuch aisa hota hai:

// mongodb+srv://username:password@cluster0.mongodb.net/<database-name>?options
// Is URI me database name specify karne ke liye, MongoDB URI ke end me /database-name likhna mandatory hota hai.

// Example:
// Let's say:

// MONGODB_URI = mongodb+srv://user:pass@cluster0.mongodb.net

// DB_NAME = myAppDB

// Then this:

// `${process.env.MONGODB_URI}/${DB_NAME}`
// becomes:

// mongodb+srv://user:pass@cluster0.mongodb.net/myAppDB
// Yaha /myAppDB batata hai ki kaunsa database use karna hai.

// Summary (Hinglish):
// / isliye lagaya gaya hai kyunki MongoDB URI me database ka naam URI ke baad / ke through diya jata hai.

// Yeh URI ka standard format hai.

// Agar /DB_NAME nahi doge, to MongoDB default database me connect karega (jo aksar galat hota hai ya exist nahi karta).

