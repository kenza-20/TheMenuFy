const Tip = require('../models/Tip');

// Get all tips
const getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find().sort({ date: -1 });
    res.status(200).json(tips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new tip
const createTip = async (req, res) => {
  const { title, content, image, date } = req.body;

  try {
    const newTip = new Tip({
      title,
      content,
      image,
      date,
    });

    const savedTip = await newTip.save(); // Save the new tip to the database
    res.status(201).json(savedTip); // Return the saved tip
  } catch (error) {
    res.status(500).json({ message: 'Error adding the tip' });
  }
};

// Delete a tip by its ID
const deleteTip = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTip = await Tip.findByIdAndDelete(id);

    if (!deletedTip) {
      return res.status(404).json({ message: 'Tip not found' });
    }

    res.status(200).json({ message: 'Tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting the tip' });
  }
};

module.exports = { getAllTips, createTip, deleteTip };
