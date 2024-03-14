const router = require('express').Router();
const warehousesController = require('../controllers/warehouses-controller');

router.route("/").get(warehousesController.index);
router.route('/:id').get(warehousesController.findOne).delete(warehousesController.remove);;
router.route('/:id/inventories').get(warehousesController.inventories);

module.exports = router;