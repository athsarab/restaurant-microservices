const express = require('express');
const auth = require('../middlewares/auth');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/dish/:dishId', reviewController.getDishReviews);

router.use(auth);

router.get('/user', reviewController.getUserReviews);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
