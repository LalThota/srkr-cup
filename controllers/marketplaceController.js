const MarketPlaceItem = require('../models/MarketPlaceItem');
const Notification = require('../models/Notification');

exports.postItem = async (req, res) => {
    try {
        const { title, description, price, contact } = req.body;
        const image = req.file ? req.file.path : null;
        
        if (!title || !description || !price) {
            return res.status(400).json({ message: 'Title, description, and price are required' });
        }
        
        const newItem = new MarketPlaceItem({
            title,
            description,
            price,
            contact: contact || req.user.phone,
            image,
            user: req.user.userId,
            status: 'pending',
            datePosted: new Date()
        });
        
        await newItem.save();
        
        // Create notification for the user
        const notification = new Notification({
            message: `Your marketplace item "${title}" has been submitted for approval.`,
            user: req.user.userId,
            type: 'system'
        });
        await notification.save();
        
        res.status(201).json({
            success: true,
            message: 'Item posted successfully and pending approval',
            item: newItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApprovedItems = async (req, res) => {
    try {
        const items = await MarketPlaceItem.find({ status: 'approved' })
            .populate('user', 'name email phone')
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserItems = async (req, res) => {
    try {
        const items = await MarketPlaceItem.find({ user: req.user.userId })
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
        
        const items = await MarketPlaceItem.find({ status: 'pending' })
            .populate('user', 'name email phone')
            .sort({ datePosted: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
