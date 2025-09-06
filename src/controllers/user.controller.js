import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apierror.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/apiresponse.js";

const generateAccessandRefreshTokens = async(userId)=>
{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // store refresh token in database ? why ? -> because we need to send it to the client in the response
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return {accessToken,refreshToken}; 
    }
    catch(error){
        throw new ApiError(500,"Error generating access and refresh tokens");
    }
}


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

const loginUser = asyncHandler(async (req,res) =>{
    // req body se data le aao
    // username or email check karo 
    // find the user 
    // password check karo 
    // generate access token and refresh token 
    // send tokens through cookies 

    const {email,username,password} = req.body;

    if(!username && !email){
        throw new ApiError(400,"Username or email is required");
    }

    if(!password){
        throw new ApiError(400,"Password is required");
    }

    // Convert username to lowercase to match registration
    const searchUsername = username ? username.toLowerCase() : username;

    // what does findOne() do ?
    // it finds the first user that matches the query
    // it returns the user object
    // it returns null if no user is found
    // it returns an error if the query is invalid
    // it is a mongoose method
    // it is a database operation

    // yaha user create kiya but accessToken is not set 
    const user = await User.findOne({
        $or :[{username: searchUsername},{email}]
    }).select("+password");

    if(!user){
        throw new ApiError(400,"User not found");
    }

    // Debug logging
    console.log("Login attempt:");
    console.log("Username/Email:", username || email);
    console.log("Search username:", searchUsername);
    console.log("User found:", user.username);
    console.log("Password provided:", password);
    console.log("User has password:", !!user.password);
    console.log("Password length:", user.password ? user.password.length : 0);

    //  difference between User and user  ??
    // User is a mongoose model(mongoose ka object hai ) and user
    //  (humne jo user banaya h uska object hai like email password and 
    // other methods like comparePassword yeh sab humare user mein available h) 
    // -> find one sab User mein h yeh mongo ke methods hai 

    const isPassword = await user.isPasswordCorrect(password);
    console.log("Password comparison result:", isPassword);

    if(!isPassword){
        throw new ApiError(400,"Invalid password");
    }

      // yeh method kya kar raha hai ?? -> generateAccessandRefreshTokens yeh kar raha hai ki 
     // access token aur refresh token generate karega 
     // aur refresh token ko database mein store karega 
     // aur access token aur refresh token ko client mein send karega 
     // aur client ko access token aur refresh token ko store karega 

    const {accessToken,refreshToken} = await generateAccessandRefreshTokens(user._id);

    // abhi user ke andar refresh token hai woh empty hai ?? because -> when we create a user, we don't set the refresh token
    // when we generate access and refresh tokens, we set the refresh token in the user object
    // and then we save the user object in the database
    // so, when we send the response, we send the user object with the refresh token
    // so, the client can use the refresh token to get a new access token


    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");  // password and refreshToken ko remove karega .select mein jo cheez nahi chahiye woh dalte h 


    // cookies ke options set kar rahe h 
    const options = {
        httpOnly : true, // ab sirf server se access karna hai 
        secure : true    
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user : loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

})



const logoutUser = asyncHandler(async (req,res) =>{

    // sabse pehle -> cookies clear karo and jo accessToken and refreshToken token ko reset karna hoga 
    // req body se data le aao
    // ab logout ke time findbyId use nahi kar sakte -> we have to create a custom middleware jaise cookie parser ka middleware add kiya h toh hum loggedinuser mein res.cookie use kar rahe the (refer loginUser above) and hum req.cookie bhi use kar skate h waise hi ek custom middleware bana kar usse bhi req and res mein use karenge user details fetch karne ke liye taaki logout ke time wapas koi form na bharana ho ...
    // find the user 
    // set refresh token to empty string 
    // save the user 
    // send response 

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("RefreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out successfully")
    )

})

export {
    registerUser,
    loginUser,
    logoutUser
}