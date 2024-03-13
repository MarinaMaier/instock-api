const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route('/:id').get(warehousesController.findOne);

router.route('/:id').get(warehousesController.findOne).patch(warehousesController.update);

router.route('/:id/inventories').get(warehousesController.inventories);

module.exports = router;