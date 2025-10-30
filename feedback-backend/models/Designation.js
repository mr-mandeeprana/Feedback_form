const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model('Designation', designationSchema);

