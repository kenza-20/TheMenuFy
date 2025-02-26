const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true }, // ✅ Add this field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "restaurant", "admin"], default: "user" }, 
    approved: { type: Boolean, default: false }, // Optional if needed
    confirmed: { type: Boolean, default: false } // Optional if needed
});

const User = mongoose.model("User", userSchema);
module.exports = User;
