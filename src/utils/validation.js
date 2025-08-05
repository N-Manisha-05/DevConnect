const validator = require("validator");

const validateSignupData = (req)=>{
    const {firstName, lastName, emailid, password}= req.body;
    if(!firstName || !lastName){
        throw new Error ("Name not valid");
    }
    else if (!validator.isEmail(emailid)){
        throw new Error ("Emailid not valid");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error ("Please enter strong password");
    }
};

const validateEditProfile = (req)=>{

    const allowedEditFields = ["age","skills","firstName","lastName","about","photourl","gender"];

    const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));

     const { photourl } = req.body;

    if (photourl && !validator.isURL(photourl)) {
        throw new Error("Photo URL is not valid");
    }
    if (req.body.about && req.body.about.length > 300) {
    throw new Error("About section cannot exceed 300 characters");
    }
    if (req.body.age && (!validator.isInt(req.body.age.toString(), { min: 0, max: 100 }))) {
    throw new Error("Age must be a valid number between 0 and 100");
    }


   return isEditAllowed;
};
module.exports = {
    validateSignupData,
    validateEditProfile

};