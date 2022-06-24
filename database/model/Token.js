const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    token: {type: String},
    email:{type:String}
});
const Token = new mongoose.model("Token", schema);
module.exports = Token;