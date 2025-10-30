const mongoose = require('mongoose');

const CementCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
});

CementCompanySchema.index({ name: 1, country: 1 }, { unique: true }); // Prevent duplicates for same country

module.exports = mongoose.model('CementCompany', CementCompanySchema);
