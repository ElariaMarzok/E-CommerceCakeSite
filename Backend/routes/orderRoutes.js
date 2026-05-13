const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/', orderController.getAllOrders);
//to change the state of order 
router.patch('/:id', orderController.updateOrderStatus);


module.exports = router;