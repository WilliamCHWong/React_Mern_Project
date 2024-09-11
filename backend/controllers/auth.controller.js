import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Controller function for user signup
export async function signup(req, res) {
    try {
        // Extract email, password, and username from request body
        const { email, password, username } = req.body;

        // Check if all fields are provided
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format using regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        // Ensure password length is at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if a user with the given email already exists
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Check if a user with the given username already exists
        const existingUserByUsername = await User.findOne({ username: username });
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword  = await bcryptjs.hash(password, salt);

        // Randomly select a profile picture from a predefined list
        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        // Create a new user instance with the provided data
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword, // Note: Password should be hashed before saving
            image: image
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with a success message (add as needed)
        res.status(201).json({ success: true, user: {
            ...newUser._doc,
            password: ""
        }});        

    } catch (error) {
        // Log the error and respond with a server error message
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Controller function for user login
export async function login(req, res) {
    res.send("Login route");
}

// Controller function for user logout
export async function logout(req, res) {
    res.send("Logout route");
}
