// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Get the authenticated user's profile
 * @route GET /api/user/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user is already set by the auth middleware
        res.json(req.user);
    } catch (error) {
        console.error('Profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Get all users (admin only)
 * @route GET /api/user/all
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Update user profile
 * @route PUT /api/user/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        // Find user by ID (from auth middleware)
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        
        await user.save();
        
        res.json({ message: 'Profile updated successfully', user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            regdNo: user.regdNo,
            role: user.role
        }});
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
