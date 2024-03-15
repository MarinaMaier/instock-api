const router = require('express').Router();
const inventoriesController = require('../controllers/inventories-controller');

router.route("/").get(inventoriesController.index).post(inventoriesController.add);
router.route("/:id").get(inventoriesController.findOne).patch(inventoriesController.update).delete(inventoriesController.remove);


module.exports = router;