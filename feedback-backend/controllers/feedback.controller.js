const Feedback = require('../models/Feedback');

// Get all feedback submissions
exports.getAllFeedback = async (req, res) => {
  try {
    console.log('Controller: GET /api/feedback - Fetching all feedback...');
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Controller Error - getAllFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message
    });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    console.log('Controller: GET /api/feedback/:id - Fetching feedback by ID:', req.params.id);
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Controller Error - getFeedbackById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Create new feedback submission
exports.createFeedback = async (req, res) => {
  try {
    console.log('Controller: POST /api/feedback - Creating new feedback...');
    console.log('Request body received:', JSON.stringify(req.body, null, 2));

    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();

    console.log('Controller: Feedback saved successfully with ID:', savedFeedback._id);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(201).json({
      success: true,
      message: 'Feedback saved successfully',
      id: savedFeedback._id,
      timestamp: savedFeedback.createdAt
    });
  } catch (error) {
    console.error('Controller Error - createFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save feedback',
      error: error.message,
      details: error.errors || 'Unknown error'
    });
  }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
  try {
    console.log('Controller: DELETE /api/feedback/:id - Deleting feedback:', req.params.id);
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
      deletedId: feedback._id
    });
  } catch (error) {
    console.error('Controller Error - deleteFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    console.log('Controller: GET /api/feedback/stats - Getting feedback statistics...');

    const totalFeedback = await Feedback.countDocuments();
    const fillPacFeedback = await Feedback.countDocuments({
      selectedProducts: { $in: ['Fill Pac'] }
    });
    const bucketElevatorFeedback = await Feedback.countDocuments({
      selectedProducts: { $in: ['Bucket Elevator'] }
    });

    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company selectedProducts createdAt');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.json({
      success: true,
      statistics: {
        totalFeedback,
        fillPacFeedback,
        bucketElevatorFeedback,
        recentSubmissions: recentFeedback
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Controller Error - getFeedbackStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedback statistics',
      error: error.message
    });
  }
};
