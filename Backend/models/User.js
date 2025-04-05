const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: String,
    userName: String,
    lastName: String,
    idNumber: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    profilePic: String, // Base64 Image
    idPhoto: String,     // Base64 Image
});

module.exports = mongoose.model("User", UserSchema);