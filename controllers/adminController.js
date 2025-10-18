const LostItem = require('../models/LostItem');
const MarketPlaceItem = require('../models/MarketPlaceItem');
const Note = require('../models/Note');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Lost Item Approval
exports.approveLostItem = async (req, res) => {
    try {
        const item = await LostItem.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

        // Create notification for the user
        if (item && item.user) {
            const notification = new Notification({
                message: `Your lost item "${item.title}" has been approved.`,
                user: item.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectLostItem = async (req, res) => {
    try {
        const item = await LostItem.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

        // Create notification for the user
        if (item && item.user) {
            const notification = new Notification({
                message: `Your lost item "${item.title}" has been rejected.`,
                user: item.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marketplace Item Approval
exports.approveMarketplaceItem = async (req, res) => {
    try {
        const item = await MarketPlaceItem.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

        // Create notification for the user
        if (item && item.user) {
            const notification = new Notification({
                message: `Your marketplace item "${item.title}" has been approved.`,
                user: item.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectMarketplaceItem = async (req, res) => {
    try {
        const item = await MarketPlaceItem.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

        // Create notification for the user
        if (item && item.user) {
            const notification = new Notification({
                message: `Your marketplace item "${item.title}" has been rejected.`,
                user: item.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Note Approval
exports.approveNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

        // Create notification for the user
        if (note && note.user) {
            const notification = new Notification({
                message: `Your note "${note.title}" has been approved.`,
                user: note.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

        // Create notification for the user
        if (note && note.user) {
            const notification = new Notification({
                message: `Your note "${note.title}" has been rejected.`,
                user: note.user,
                type: 'system'
            });
            await notification.save();
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Management
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -otp -otpExpiry');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear all non-admin users
exports.clearNonAdminUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({ role: { $ne: 'admin' } });
        res.json({
            message: `Successfully deleted ${result.deletedCount} non-admin users`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: 'User promoted to admin successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
