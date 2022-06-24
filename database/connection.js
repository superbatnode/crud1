const mongoose = require("mongoose"); 
const { DBURL } = require("../config");
const connection = async ()=>{
    await mongoose.connect(DBURL)
}
module.exports = connection; 