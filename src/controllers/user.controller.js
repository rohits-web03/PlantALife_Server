import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error while generating tokens:", error);
      return { statusCode: 500, message: "Something went wrong while generating refresh and access tokens" };
    }
  };

const registerUser = async (req, res) => {
    try {
        const { name, email, password, metamaskAddress } = req.body;
        console.log(req.body,name,email,password,metamaskAddress);
      
        if ([name, email, password].some((field) => field?.trim() === '')) {
          return res.status(400).json("All fields are required!!");
        }
        const existedUser = await User.findOne({ email });

        if (existedUser) {
          return res.status(400).json("User with email exists.Please Login!!");
        }
        const metamaskAddr = metamaskAddress || '';
            // Get file path from multer
            const localFilePath = req.files['profileImage'][0].path;
            console.log(localFilePath);
    
            // Upload file to Cloudinary
            const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    
            // If file upload to Cloudinary was successful
            if (cloudinaryResponse && cloudinaryResponse.url) {
                // Create a new User object with coordinates
                const newUser = new User({
                    name,
                    email,
                    password,
                    metamaskAddress: metamaskAddr, 
                    avatar: cloudinaryResponse.url // Store Cloudinary URL
                });
    
                console.log("Cloudinary Url:",cloudinaryResponse.url)
    
                // Save User object to MongoDB
                await newUser.save();
    
                // Return success response
                return res.status(200).json({ message: 'User Registered successfully', user:newUser });
            } else {
                // If file upload to Cloudinary failed
                return res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
            }
        } catch (error) {
            console.error("Error: ", error);
            res.status(500).json({ error: "Cannot register user at the moment!" });
        }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Basic email format validation
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(isPasswordValid,password)
  
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid user credentials" });
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    user.refreshToken=refreshToken;
    const loggedInUser = user.toObject(); // Convert Mongoose document to plain JavaScript object
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    console.log(accessToken,refreshToken)
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
      });
  };

const logoutUser = async(req, res) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } }, 
      { new: true }
    );
  
    if (!updatedUser) {
      return res.status(404).json({ statusCode: 404, message: "User not found" });
    }
  
    const options = {
        httpOnly: true,
        secure: true
    }
  
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({statusCode:200,  message:"User logged Out"})
}

const updateSeeds= async (req, res) => {
    try {
      const userID = req.params.userID;
  
      // Find the user by ID
      const user = await User.findById(userID);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.seeds += 10;
      await user.save();
  
      res.status(200).json({ message: 'Seeds updated successfully', seeds: user.seeds });
    } catch (error) {
      console.error('Error updating seeds:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const updateBalance=async (req, res) => {
    try {
      const { amount, userID } = req.query;
  
      // Ensure amount is a number
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        return res.status(400).json({ message: 'Amount must be a valid number' });
      }
  
      // Find the user by userID
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's balance
      user.accBalance += parsedAmount;
      await user.save();
  
      return res.status(200).json({ message: 'Balance updated successfully', user });
    } catch (error) {
      console.error('Error updating balance:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

export {registerUser,loginUser,logoutUser,updateSeeds,updateBalance};