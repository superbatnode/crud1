const mongoose = require("mongoose"); 
const schema = new mongoose.Schema({
    email:String, 
    token: String, 
    password:String  
}); 
const ResetPassword = new mongoose.model("ResetPassword", schema); 
module.exports = ResetPassword;