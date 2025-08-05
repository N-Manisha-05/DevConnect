const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const {userAuth} = require("../middleware/auth");
const {validateEditProfile} = require("../utils/validation");
const User = require("../models/user");

//GET:profile
profileRouter.get("/profile/view",userAuth, async(req,res)=>{

    try{

        const user = req.user;

        if(!user){
            throw new Error("No user found,Try logging again");
        }

        res.send(user);

    }catch(err){
        res.send("Something went wrong"+err.message);
    }

});

//edit profile
profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{

    try{

        if(!validateEditProfile(req)){
            throw new Error("Invalid edit request");
        }

        const loggedUser = req.user;
        Object.keys(req.body).forEach(key => loggedUser[key] = req.body[key]);
        await loggedUser.save();
        res.send(`${loggedUser.firstName} , Your profile updated successfully`);

    }catch(err){
        res.send("Something went wrong"+err.message);
    }

});

// edit password
profileRouter.patch("/profile/password", userAuth, async(req,res)=>{

  
    try { 
        const {_id} = req.user;
        const{currentPassword, newPassword} = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send("Both current and new passwords are required");
        }

        const user = await User.findById(_id);

        if(!user){
            throw new Error("Invalid credentials");
        }

        const ispassword = user.validatePassword(currentPassword);

        if(!ispassword){

            throw new Error("Invalid credentials");

        }else{
            const hashedPassword = await bcrypt.hash(newPassword,10);
            user.password = hashedPassword;
            await user.save();
            res.send("Password updated Successfully");

        }
    }catch(err){
        res.send("Something went wrong"+err.message);
    }
});


module.exports = {profileRouter};