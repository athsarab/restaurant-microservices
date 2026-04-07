const express = require('express');
const auth = require('../middlewares/auth');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.use(auth);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getUserPayments);
router.get('/order/:orderId', paymentController.getPaymentByOrder);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id/status', paymentController.updatePaymentStatus);

module.exports = router;
