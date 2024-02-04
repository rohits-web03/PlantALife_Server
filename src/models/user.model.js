import {Schema,model} from "mongoose";
import jwt from "jsonwebtoken";  
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
    name:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    avatar:{
        type:String,
        required:true
    },
    metamaskAddress:{
        type:String
    },
    treesPlanted:[{
        type:Schema.Types.ObjectId,
        ref:"Tree"
    }],
    accBalance:{
        type:Number,
        default:0
    },
    transaction:[{
        type:Schema.Types.ObjectId,
        ref:"Transaction"
    }],
    seeds:{
        type:Number,
        default:0
    },
    googleID:{
        type:String
    },
    facebookID:{
        type:String
    },
    twitterID:{
        type:String
    },
    githubID:{
        type:String
    },
    refreshToken:{
        type:String
    }
    },
    {timestamps:true}
)

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
  
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });
  

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=model("User",userSchema)