const express = require('express');
const router = express.Router();
const CementCompany = require('../models/CementCompany');

// Get all companies
// GET /api/cement-companies?country=India
router.get('/', async (req, res) => {
  const { country } = req.query;

  try {
    const query = country ? { country } : {};
    const companies = await CementCompany.find(query).sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Add new company
// POST /api/cement-companies
router.post('/', async (req, res) => {
  const { name, country } = req.body;
  if (!name || !country) {
    return res.status(400).json({ error: 'Company name and country are required' });
  }

  try {
    const existing = await CementCompany.findOne({ name, country });
    if (existing) {
      return res.status(200).json({ message: 'Company already exists' });
    }

    const newCompany = new CementCompany({ name, country });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add company' });
  }
});


module.exports = router;
