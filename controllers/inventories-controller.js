const knex = require("knex")(require("../knexfile"));

const index = async (_req, res) => {
  try {
    const data = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
};

const findOne = async (req, res) => {
  try {
    const inventory = await knex("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where({ "inventories.id": req.params.id })
      .first();

    if (!inventory) {
      return res.status(404).json({
        error: `Inventory with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory with with ID ${req.params.id}: ${error}`,
    });
  }
};

module.exports = {
  index,
  findOne,
};
