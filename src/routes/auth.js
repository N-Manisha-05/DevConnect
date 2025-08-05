const express = require("express");
const authRouter = express.Router();


const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// Signup
authRouter.post("/signup",async(req,res)=>{
    // console.log(req.body);
   
    try{
        const {firstName, lastName, emailid, password}  = req.body;
        validateSignupData(req);
        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            emailid,
            password: hashPassword,
     }); 
        await user.save();
        res.send("User added successfully");

    }catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }

});

//login
authRouter.post("/login", async(req,res)=>{
    try{
        const {emailid, password} = req.body;
        const user = await User.findOne({emailid:emailid});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const ispassword = user.validatePassword(user.password);

        if(!ispassword){

            throw new Error("Invalid credentials");

        }else{

            const token = await user.getJWT();

            res.cookie("token",token);

            res.send("Login successfull");
        }
    

    }catch(err){
        console.log(err.message);
        res.send("Something went wrong"+err.message);
    }
});

//logout
authRouter.post("/logout",async(req,res)=>{

   try{
        res.cookie("token",null, {
            expires: new Date(Date.now()),
        });

        res.send("logged out successfully");
    }catch(err){
        res.status(400).send("Something went wrong "+ err.message);
    }

});

module.exports = {authRouter};