const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();

app.use(express.json());

// POST:signup
app.post("/signup",async(req,res)=>{
    // console.log(req.body);
   
    try{
        const user = new User(req.body); 
        await user.save();
        res.send("User added successfully");

    }catch(err){
        res.status(400).send("Something went wrong");
    }

});

//GET:feed
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        if (users.length == 0){
            res.status(404).send("User not found");
        }else{
            res.send(users)
        }
        

    }catch(err){
        console.error(err.message);
        res.status(400).send("Something went wrong");
    }

});

//DELETE :user
app.delete("/user",async(req,res)=>{
    const userid = req.body.userid;

    try{
        await User.findByIdAndDelete(userid);
        res.send("User deleted successfully");

    }catch(err){
        console.error(err.message);
        res.status(400).send("Something went wrong");
    }
});

//PATCH : update

app.patch("/user",async(req,res)=>{
    const userid = req.body.userid;
    const data = req.body

    try{
        await User.findByIdAndUpdate({_id:userid},data);
        res.send("User updated successfully");

    }catch(err){
        console.error(err.message);
        res.status(400).send("Something went wrong");
    }
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

