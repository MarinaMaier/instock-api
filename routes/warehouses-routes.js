const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");

router.route("/").get(warehousesController.index).post(warehousesController.add);
router.route('/:id').get(warehousesController.findOne).put(warehousesController.update).delete(warehousesController.remove);
router.route('/:id/inventories').get(warehousesController.inventories);

module.exports = router;
