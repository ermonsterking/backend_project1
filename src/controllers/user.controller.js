import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessTokens()
        const refreshToken = user.generateRefreshTokens()
        user.refreshToken = refreshToken
         await user.save({validateBeforSave: false})

         return {accessToken, refreshToken}


    }catch(error) {
        throw new ApiError(500, "something went wrong while generating  refreshtokens")

    }
}


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

    const exitedUser= await User.findOne({
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

     const user = await User.create({
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

const loginUser = asyncHandler( async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // check password
    // access and refresh token
    // send cookies


    const {email, username, password} = req.body

    if (!username || !email)  {
        if (!username || !email){
            throw new ApiError(400, "Usename or email is required")
        }
        const user = await User.findOne({
            $or: ror[{username}, {email}]
        })

        if (!user) {
            throw new ApiError(404, "User does not exist")

        }

        const isPasswordVlid = await user.isPasswordCorrect(password)

        if (!isPasswordVlid) {
            throw new ApiError(401, "Invalid password")
        }

        const {accessToken, refreshToken} = await
         generateAccessAndRefreshTokens(user._id)

         const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken")


        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken","accessToken", options)
        .cookie("refreshToken", "refreshToken", options)
        .json (
        new ApiResponse(
            200,
        
            {user: loggedInUser, accessToken, refreshToken},
            "User logged in successfully"
        )

    )
        
    }

})

const logoutUser = asyncHandler (async (req, res) => {
     await User.findByIdAndUpdate
         (req.user._id, 
             { $set:{
                refreshToken: undefined
             }
            })

            
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )

})




export {
    registerUser,
    loginUser,
    logoutUser

}