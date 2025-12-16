import bcrypt from "bcryptjs";
import User from "../models/userModels.js";
import { generateToken } from "../lib/utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format"});
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });  
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registeres" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                likedSongs: newUser.likedSongs,
                downloadedSongs: newUser.downloadedSongs,
                createdAt: newUser.createdAt,
             });
        } else {
            res.status(400).json({ error: "Invalid user data" });   
            }
    } catch (error) {
        console.log(`Error in register controller ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        
        if (!user && !isPasswordCorrect) {
            return res.status(200).json({
                error: "Username does not exist. Please register"
            });
        }
        
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            likedSongs: user.likedSongs,
            downloadedSongs: user.downloadedSongs,
            createdAt: user.createdAt,
        });


    } catch (error) {
        console.log(`Error in login controller ${error.message}`);
        res.status(500).json({ error: error.message });
        
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(`Error in logout controller ${error.message}`);
        res.status(500).json({ error: error.message });
        
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(`Error in getMe controller ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

