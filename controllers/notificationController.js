const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
    try {
        const { message, userId, type } = req.body;
        
        if (!message || !userId) {
            return res.status(400).json({ message: 'Message and userId are required' });
        }
        
        const notification = new Notification({ 
            message, 
            user: userId,
            type: type || 'system',
            createdAt: new Date(),
            read: false
        });
        
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            user: req.user.userId,
            read: false
        }).sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: req.user.userId },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or not authorized' });
        }
        
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user.userId, read: false },
            { read: true }
        );
        
        res.json({ 
            message: 'All notifications marked as read',
            count: result.nModified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const notifications = await Notification.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
