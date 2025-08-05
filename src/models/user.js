const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{type:String},
    emailid:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email id is not valid");
            }
        }

    },
    password:{
        type:String,
        required:true,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }

    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data not valid");
            }
        }
    },
    photourl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo url is not valid");
            }
        }
    },
    about:{
        type:String,
        default:"This is default about of user"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Dev$Connect@123",{expiresIn:"7d"});

    return token

};

userSchema.methods.validatePassword = async function(passwordByUser){

    const passwordHash = this.password;
    const isPasswordValid = await bcrypt.compare(passwordByUser,passwordHash);
    return isPasswordValid;
};

const User = mongoose.model("User",userSchema);
module.exports = User;