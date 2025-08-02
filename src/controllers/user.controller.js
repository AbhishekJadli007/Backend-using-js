import asyncHandler from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req,res) =>{

    //get user details from frontend
    // validation - not empty 
    // check if user already exists :username,email 
    // check for images , check for avatar 
    // upload images to cloudinary , avatar
    // create user object -create entry in database
    // remove password and refreshToken from response field from response 
    // check for user creation 
    // return response 

    const {username,email,password,fullname,avatar,coverImage} = req.body;
    if(!username || !email || !password || !fullname){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }
    
    res.status(200).json({
        message : "OK"
    })
} )

const loginUser = asyncHandler(async (req,res) =>{
    res.status(200).json({
        message : "OK"
    })
} )

export {registerUser,loginUser}