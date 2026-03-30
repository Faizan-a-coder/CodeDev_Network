import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { syncQueue } from "../workers/sync.queue.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Create a user manually
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role, platforms } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Username, email, and password required" });
        }

        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
            platforms: platforms || {}
        });

        // Don't send back the password
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, message: "User created", data: userObj });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, rating, solvedCount, platforms, password } = req.body;

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (rating !== undefined) updateData.rating = rating;
        if (solvedCount !== undefined) updateData.solvedCount = solvedCount;
        if (platforms) updateData.platforms = platforms;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated", data: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Sync a specific user
export const syncSpecificUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        syncQueue.push(user);
        res.status(200).json({ success: true, message: `User ${user.username} queued for sync.` });
    } catch (err) {
        console.error("Admin user sync error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Sync all users
export const syncAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        users.forEach(user => syncQueue.push(user));
        res.status(200).json({ success: true, message: `All ${users.length} users have been queued for sync.` });
    } catch (err) {
        console.error("Admin full sync error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
