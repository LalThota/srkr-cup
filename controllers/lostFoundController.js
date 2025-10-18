const LostItem = require('../models/LostItem');
const Notification = require('../models/Notification');

exports.postItem = async (req, res) => {
    try {
        const { title, description, location, itemType, userContact } = req.body;
        const image = req.file ? req.file.path : null;

        if (!title || !description || !location || !itemType || !userContact) {
            return res.status(400).json({
                message: 'Title, description, location, item type (lost/found), and mobile number are required'
            });
        }

        // Validate mobile number
        if (!/^[0-9]{10}$/.test(userContact)) {
            return res.status(400).json({
                message: 'Please enter a valid 10-digit mobile number'
            });
        }

        // Validate itemType
        if (!['lost', 'found'].includes(itemType)) {
            return res.status(400).json({
                message: 'Item type must be either "lost" or "found"'
            });
        }

        const newItem = new LostItem({
            title,
            description,
            location,
            image,
            itemType,
            userContact,
            userId: req.user.userId,
            userName: req.user.name,
            status: 'pending',
            datePosted: new Date()
        });

        await newItem.save();

        // Create notification for the user
        const notification = new Notification({
            message: `Your ${itemType} item "${title}" has been submitted for approval.`,
            user: req.user.userId,
            type: 'system'
        });
        await notification.save();

        // Notify all users about the new item
        await notifyAllUsers(
            `New ${itemType} item reported: "${title}" at ${location}. Contact: ${userContact}`,
            req.user.userId // exclude the posting user
        );

        res.status(201).json({
            success: true,
            message: 'Lost item posted successfully and pending approval',
            item: newItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApprovedItems = async (req, res) => {
    try {
        const items = await LostItem.find({ status: 'approved' })
            .populate('user', 'name email phone')
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserItems = async (req, res) => {
    try {
        const { type } = req.query; // type can be 'lost' or 'found'
        const query = { user: req.user.userId };

        if (type && ['lost', 'found'].includes(type)) {
            query.itemType = type;
        }

        const items = await LostItem.find(query)
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingItems = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const items = await LostItem.find({ status: 'pending' })
            .populate('user', 'name email phone')
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to notify all users
const notifyAllUsers = async (message, excludeUserId = null) => {
    try {
        const User = require('../models/User');
        const users = await User.find(excludeUserId ? { _id: { $ne: excludeUserId } } : {});

        const notifications = users.map(user => ({
            user: user._id,
            message,
            type: 'update'
        }));

        await Notification.insertMany(notifications);
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};
