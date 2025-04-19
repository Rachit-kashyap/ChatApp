const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const SMS = require("../config/twillow");
const OTP = require("../config/otpGenerator");
const jwt = require("jsonwebtoken");
const auth = require("../middelware/auth");

let otpStorage = {};  // Store OTPs with phone numbers as keys

// Render login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle login request and send OTP
router.post('/login', async (req, res) => {
    try {
        let { name, phoneNumber,email } = req.body;

        if(!email||!name||!phoneNumber)
        {
            return res.send("Enter Proper Details")
        }


        // Check if user already exists
        let isUserExist = await User.findOne({ phoneNumber });

        // Generate OTP
        let otp = OTP();
        console.log(otp);
        
        otpStorage[phoneNumber] = otp;  // Store OTP with phoneNumber as key

        // Send OTP via SMS
        SMS(email,otp);

        // If user exists, ask to verify OTP
        if (isUserExist) {
            return res.render("verifyOtp", { phoneNumber });
        }

        // If user does not exist, create a new user
        await new User({ name, phoneNumber }).save();
        return res.render("verifyOtp", { phoneNumber });

    } catch (error) {
        console.error("Error in /login:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Handle OTP verification
router.post("/verify-otp", async (req, res) => {
    try {
        let { phoneNumber, otp } = req.body;


        // Check if OTP matches
        if (otpStorage[phoneNumber] && otpStorage[phoneNumber] == otp) {  
            delete otpStorage[phoneNumber];  // Remove OTP after verification

            // Update user status to active
            let user = await User.findOneAndUpdate(
                { phoneNumber }, 
                { isActive: true }, 
                { new: true }
            );

            // Generate JWT token
            let token = jwt.sign({ phoneNumber,_id:user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
            res.cookie("token",token);
            return res.redirect("/user");
        }

        return res.status(400).json({ success: false, message: "Invalid OTP. Try again." });

    } catch (error) {
        console.error("Error in /verify-otp:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
