const mongoose = require("mongoose");

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://Node:MPMV_25423@cluster0.tmwxnic.mongodb.net/DevConnect?retryWrites=true&w=majority");
}

module.exports = connectDB;