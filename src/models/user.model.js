import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true, // to make the field searchable faster in the database
    },
    fullname :{
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    email :{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    avatar :{
        type : String, // cloudinary url
        required : true,
    },
    coverImage :{
        type : String, // cloudinary url
    },
    watchHistory :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video",
        }
    ],
    password :{
        type : String,
        required : [true,"Password is required"],
        minlength : [8,"Password must be at least 8 characters long"],
        maxLength : [50,"Password must be less than 50 characters long"],
        select : false,
    },
    refreshToken :{
        type : String,
    }
},{timestamps: true})

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname,
        }
        ,process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        });
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        }
        ,process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        });
}

export const User = mongoose.model("User",UserSchema);





