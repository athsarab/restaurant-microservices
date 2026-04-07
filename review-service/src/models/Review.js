const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dish'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1, dish: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
