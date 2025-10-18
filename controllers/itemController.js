const Item = require('../models/Item');

exports.createItem = async (req, res) => {

    const { title, description, type } = req.body;

    const item = new Item({ title, description, type, user: req.user._id });

    await item.save();

    res.status(201).json(item);

};

exports.getUserItems = async (req, res) => {

    const items = await Item.find({ user: req.user._id });

    res.json(items);

};

exports.getAllItems = async (req, res) => {

    const items = await Item.find();

    res.json(items);

};

exports.approveItem = async (req, res) => {

    const item = await Item.findById(req.params.id);

    item.status = 'approved';

    await item.save();

    res.json(item);

};
