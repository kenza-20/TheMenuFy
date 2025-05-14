
const express = require('express');
const authenticate = require('../middleware/authMiddleware')
const mealController = require('../controlleurs/orderController');
const tableController = require ("../controlleurs/tableController")
const router = express.Router()
router.post('/add', mealController.addOrder)
router.delete('/:id_user/:price_id', mealController.deleteOrder)
router.delete('/:id_user', mealController.deleteAllOrders)
router.get('/:id_user', mealController.getOrdersByUser)
router.put('/:id_user/:price_id/increment', mealController.incrementQuantity)
router.put('/:id_user/:price_id/decrement', mealController.decrementQuantity)
router.get('/qr/:tableId', mealController.getOrdersByQRCode);
router.get('/qr/generate/:tableId', mealController.generateQRCodeForTable);

router.post('/table', tableController.addTable);  // Create a new table
router.get('/tables', tableController.getTables);  // Get all tables
router.get('/table/:tableId', tableController.getTableById);  // Get a specific table by ID
router.put('/table/:tableId/status', tableController.updateTableStatus);  // Update table status (occupied/unoccupied)
router.delete('/table/:tableId', tableController.deleteTable);  // Delete a specific table
  
module.exports = router;