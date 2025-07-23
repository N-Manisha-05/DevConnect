const express = require("express");
const app = express();

app.use("/test",(req,res)=>{
    res.send("Welcome to server");
});

app.use("/home",(req,res)=>{
    res.send("welcome to home page");
});
app.listen(7777,()=>{
    console.log("Server successfully running on port 7777!");
})