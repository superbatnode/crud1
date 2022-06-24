const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const addressSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    address: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    phoneno: { type: Number, required: true }
})
const Address = new mongoose.model("Address", addressSchema);
module.exports = Address;