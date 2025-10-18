const Note = require('../models/Note');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        
        const note = new Note({ 
            title, 
            content, 
            user: req.user.userId,
            status: 'pending',
            dateUploaded: new Date()
        });
        
        await note.save();
        
        // Create notification for the user
        const notification = new Notification({
            message: `Your note "${title}" has been submitted for approval.`,
            user: req.user.userId,
            type: 'system'
        });
        await notification.save();
        
        res.status(201).json({
            success: true,
            message: 'Note created successfully and pending approval',
            note
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId })
            .sort({ dateUploaded: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const notes = await Note.find()
            .populate('user', 'name email')
            .sort({ dateUploaded: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id, 
            { status: 'approved' }, 
            { new: true }
        );
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        
        // Create notification for the user
        const notification = new Notification({
            message: `Your note "${note.title}" has been approved.`,
            user: note.user,
            type: 'system'
        });
        await notification.save();
        
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id, 
            { status: 'rejected' }, 
            { new: true }
        );
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        
        // Create notification for the user
        const notification = new Notification({
            message: `Your note "${note.title}" has been rejected.`,
            user: note.user,
            type: 'system'
        });
        await notification.save();
        
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadNote = async (req, res) => {
    try {
        const { title, subject, semester, description } = req.body;
        const file = req.file;
        
        if (!file) {
            return res.status(400).json({ message: 'File is required' });
        }
        
        if (!title || !subject || !semester) {
            return res.status(400).json({ message: 'Title, subject, and semester are required' });
        }
        
        const newNote = new Note({
            title,
            subject,
            semester,
            description,
            user: req.user.userId,
            fileName: file.originalname,
            fileUrl: file.path,
            fileSize: file.size,
            status: 'pending',
            dateUploaded: new Date()
        });
        
        await newNote.save();
        
        // Create notification for the user
        const notification = new Notification({
            message: `Your note "${title}" has been submitted for approval.`,
            user: req.user.userId,
            type: 'system'
        });
        await notification.save();
        
        res.status(201).json({
            success: true,
            message: 'Note uploaded successfully and pending approval',
            note: newNote
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApprovedNotes = async (req, res) => {
    try {
        const notes = await Note.find({ status: 'approved' })
            .populate('user', 'name email')
            .sort({ dateUploaded: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingNotes = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const notes = await Note.find({ status: 'pending' })
            .populate('user', 'name email')
            .sort({ dateUploaded: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
