// In routes/designationRoutes.js or similar
const express = require('express');
const router = express.Router();
const Designation = require('../models/Designation.js');

// POST /api/designations
router.post('/', async (req, res) => {
 try {
    const { designation } = req.body;
    console.log("🛠️ Received:", designation);

    if (!designation || typeof designation !== 'string') {
      return res.status(400).json({ error: 'Invalid designation' });
    }

    const newDesignation = new Designation({ designation });
    await newDesignation.save();
    
    res.status(200).json({ message: 'Saved' });
  } catch (err) {
    console.error('🔥 Error saving designation:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/designations
router.get('/', async (req, res) => {
  try {
    const designations = await Designation.find().sort({ designation: 1 }); // optional sort
    res.json(designations.map(d => d.designation));
  } catch (err) {
    console.error('Error fetching designations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
