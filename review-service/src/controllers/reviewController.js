const Review = require('../models/Review');

exports.getDishReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ dish: req.params.dishId })
      .sort('-createdAt')
      .populate('user', 'name');

    return res.json(reviews);
  } catch (err) {
    console.error('Error getting dish reviews:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).sort('-createdAt');
    return res.json(reviews);
  } catch (err) {
    console.error('Error getting user reviews:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { dish, rating, comment } = req.body;

    if (!dish || !rating || !comment) {
      return res.status(400).json({ message: 'dish, rating and comment are required' });
    }

    const existingReview = await Review.findOne({ user: req.user.id, dish });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.isEdited = true;
      await existingReview.save();
      return res.json(existingReview);
    }

    const review = new Review({
      user: req.user.id,
      dish,
      rating,
      comment
    });

    const savedReview = await review.save();
    return res.status(201).json(savedReview);
  } catch (err) {
    console.error('Error creating review:', err);

    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this dish' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    review.isEdited = true;

    await review.save();
    return res.json(review);
  } catch (err) {
    console.error('Error updating review:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
