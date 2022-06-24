const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const photoSchema = new mongoose.Schema({
    user:{ type: Schema.Types.ObjectId, ref: "User" },
    photo:{type:String},
    src:String
}); 
const Photo = new mongoose.model("Photos", photoSchema); 
module.exports = Photo; 