const Table = require('../models/TableModel');

// CREATE a new table
exports.addTable = async (req, res) => {
  try {
    const { tableId, capacity, isOccupied } = req.body;
    const table = new Table({
      tableId,
      capacity,
      isOccupied: isOccupied || false,  // Default to false (unoccupied)
    });
    await table.save();
    res.status(201).json(table);  // Send the created table as the response
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ all tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();  // Fetch all tables from the database
    res.json(tables);  // Send the list of tables as the response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ a specific table by tableId
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({ tableId: req.params.tableId });  // Fetch a table by its ID
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);  // Send the found table as the response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a table's status (mark it as occupied or unoccupied)
exports.updateTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { isOccupied } = req.body;  // Get the new status (occupied or not)
    const table = await Table.findOneAndUpdate(
      { tableId },
      { isOccupied },  // Update the table's status
      { new: true }  // Return the updated table
    );
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);  // Send the updated table as the response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a specific table by tableId
exports.deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findOneAndDelete({ tableId });  // Delete the table by its ID
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.status(204).end();  // No content, but successful deletion
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
