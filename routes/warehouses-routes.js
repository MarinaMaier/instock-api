const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route('/:id').get(warehousesController.findOne);

module.exports = router;