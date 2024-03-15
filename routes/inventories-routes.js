const router = require('express').Router();
const inventoriesController = require('../controllers/inventories-controller');

router.route("/").get(inventoriesController.index);
router.route("/:id").get(inventoriesController.findOne).patch(inventoriesController.update);

module.exports = router;