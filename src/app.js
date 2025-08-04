const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// POST:signup
app.post("/signup",async(req,res)=>{
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

// POST:Login
app.post("/login", async(req,res)=>{
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

//GET:profile
app.get("/profile",userAuth, async(req,res)=>{

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

//POST:sendConnectionRequest
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

    const user = req.user;
    res.send(user.firstName+" sent the connection request");

});

connectDB().then(()=>{
    console.log("Database Connected successfully.");
    app.listen(7777,()=>{
    console.log("Server successfully running on port 7777!!");
})
}
).catch((err)=>{
    console.error("database connectivity issue");
});

