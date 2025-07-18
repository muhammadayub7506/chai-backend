import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler (async (req, res) => {

    // get user detail from forntend.
    // validation - not empty.
    // check if user already exist: username, email:
    // check for images, check for avatar.
    // upload them to cloudinary, avatar.
    // create use object - create entry in db.
    // remove password and refresh token field from response.
    // check for user creation.
    // return res.
  
    const {fullName, email, username, password} = req.body

    if(
        [fullName, email, password, username].some((field) => field?.trim() === "" ) 
    ) {
        throw new ApiError(400, "All fields are required")  
    }

    const existedUser = await User.findOne({
        $or: [{username} , {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "Email or username is already register")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverImagelocalpath = req.files?.coverImage[0]?.path;

    let coverImagelocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImagelocalpath = req.files.coverImage[0].path
    }

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = await uploadOnCloudinary(coverImagelocalpath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select( "-password -refreshToken" )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

export {registerUser}