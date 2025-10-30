// models/feedback.model.js
const mongoose = require('mongoose');

const fillPacUnitDetailSchema = new mongoose.Schema({
  id: String,
  installationDate: String,
  spouts: String,
  documents: [String]
}, { _id: false });

const bucketElevatorUnitDetailSchema = new mongoose.Schema({
  id: String,
  installationDate: String,
  functionFeedback: String,
  beltSlippage: String,
  maintenanceFeedback: String,
  suggestions: String,
  elevatorType: String,
  documents: [String]
}, { _id: false });

const elevatorFeedbackSchema = new mongoose.Schema({
  implementationUnderstanding: String,
  failureIdentification: String,
  training: String,
  dashboardUsability: String,
  maintenanceImpact: String,
  downtimeReduction: String,
  supportExperience: String,
  suggestions: String
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  name: String,
  number: String,
  email: String,
  designation: String,
  country: String,
  company: String,
  othercementcompany: String,
  plantlocation: String,
  selectedProducts: [String],

   fillPac: {
    totalUnits: Number,
    monitoredUnits: Number,
    unitDetails: [fillPacUnitDetailSchema],
    oeeDataAccurate: String,                 // Yes | No
    oeeInaccuracyDetails: String,
    performanceAccurate: String,            // Yes | No
    performanceInaccuracyDetails: String,
    qualityAccurate: String,                // Yes | No
    qualityInaccuracyDetails: String,
    availabilityAccurate: String,           // Yes | No
    availabilityInaccuracyDetails: String,
    bagCountMatch: String,                  // Yes | No
    bagCountMismatchDetails: String,
    dataUpdate: String,                     // Yes | No | Not sure
    bottleneckHelp: String,                 // Always | Sometimes | Rarely | Never
    usefulMetric: String,                   // Availability | Performance | Quality
    missingFeatures: String,                // Yes | No
    missingFeatureDetails: String,
    additionalVisualizations: String,
    alerts: String,                         // Yes | No | Not required
    faultIdleTimeHelpful: String,           // Yes | No
    bagInfoHelpful: String,                 // Yes | No
    additionalComments: String,
    userFriendly: String,   
   },

  bucketElevator: {
    totalUnits: Number,
    monitoredUnits: Number,
    unitDetails: [bucketElevatorUnitDetailSchema],
    feedback: elevatorFeedbackSchema
  }
}, { timestamps: true, minimize: false });

module.exports = mongoose.model('Feedback', feedbackSchema);
