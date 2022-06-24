const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    address: [{ type: Schema.Types.ObjectId, ref: "Address" }]
});
const User = new mongoose.model("User", userSchema);
module.exports = User;

//username, password, confirm password, email id, firstname, lastname
