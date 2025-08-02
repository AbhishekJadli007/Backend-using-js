import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; // fs is a node module that allows us to read and write files(its a file system module)


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto",
        });
        // file has been uploaded successfully
        console.log("File uploaded successfully on cloudinary",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath); // delete the file from the local file system if the upload fails
        return null;
    }
}

export {uploadOnCloudinary};