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
}

module.exports = {validateSignupData};