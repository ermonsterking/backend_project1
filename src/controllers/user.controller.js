import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
   // get user details from frontend
   // validationm-- not empty
   // check if user exist: username, email

   // check for image, check for avatar
   // upload them to cloudnary, avatar

   // create user object - create entry in db
   // remove password and refresh tokem field from response
   // check for user creation
   // return response


   const {fullname,email, username, password}=req.body
   console.log("email:",email);

   if (
    [fullname,email,username,password].some((field) =>
        field?.trim()  === "")
      ){
        throw new ApiError(400,"All fields are required")
      }

    const exitedUser= User.findOne({
        $or: [{username}, {email}]
    })  

    if (exitedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
            throw new ApiError(400,"Avatar file is required")   


    }

    const avatar= await uploadOnCloudnary(avatarLocalPath)
    const coverImage = await uploadOnCloudnary(coverImageLocalPath)

    if (!avatar){
                    throw new ApiError(400,"Avatar file is required")   

    }

     const user = awaitUser.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    // by using select with negative sign doesnot allowed password

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


export {
    registerUser,
}