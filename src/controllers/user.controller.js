import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apierror.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/apiresponse.js";

const registerUser = asyncHandler(async (req,res) =>{

    //get user details from frontend  
    // validation - not empty 
    // check if user already exists :username,email 
    // check for images , check for avatar 
    // upload images to cloudinary , avatar
    // create user object -create entry in database
    // remove password and refreshToken from response field  
    // check for user creation 
    // return response 
    

    // 1. get user details from frontend  -> how to get ?
    //  we have user details in body of the request  and we can access it using req.body
    console.log("req.body:", req.body);
    console.log("req.files:", req.files); 

    const {username,email,password,fullname} = req.body;  // destructuring the body of the request

    if(!username || !email || !password || !fullname){
      throw new ApiError(400,"All fields are required");
    }

    const existingUser = await User.findOne({
        $or : [{username : username},{email : email}]
    })

    if(existingUser){
        throw new ApiError(409,"User already exists",[{path : "username",message : "Username already exists"},{path : "email",message : "Email already exists"}]);
    }

    // check for images , check for avatar files are accessed using multer middleware (req.files)

    const avatarLocalPath = req.files.avatar && (req.files.avatar[0].path);

    const coverImageLocalPath = req.files.coverImage && (req.files.coverImage[0].path);

    if(!avatarLocalPath ){
        throw new ApiError(400,"Avatar Local Path not found");
    }
     
    // upload images to cloudinary , avatar
    console.log("Avatar local path:", avatarLocalPath);
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400,"Avatar is required");
    }
     
    // create user object -create entry in database


    const newUser = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    // find the user in database 
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    // check for user creation 
    if(!createdUser){
        throw new ApiError(500,"User not registered , not created");
    }

    // return response 
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
    )

} )


export {registerUser}