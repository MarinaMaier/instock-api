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

const add = async (req, res) => {
  try {
    const requiredFields = [
      "warehouse_id",
      "item_name",
      "description",
      "category",
      "status",
      "quantity"
    ];

    //check if field is empty if not insert into the table
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `invalid input: ${field} was null or empty`,
        });
      }
    }

    //check if warehouse exists
    const warehouse = await knex("warehouses").where({ id: req.body["warehouse_id"] });
    if (warehouse.length === 0) {
      return res.status(400).json({
        message: `Warehouse ${req.body["warehouse_id"]} does not exist`,
      });
    }

    //check if quantity is not a number
    const stringNum = parseInt(req.body["quantity"]);

    if (!Number.isInteger(stringNum)) {
      return res.status(400).json({
        message: `${req.body["quantity"]} is not a valid number`,
      });
    } else if (stringNum < 0) {
      return res.status(400).json({
        message: `${req.body["quantity"]} cannot be under 0`,
      });
    }

    //add inventory and display the inventory item
    const result = await knex("inventories").insert(req.body);

    //select specific columns as there is also created_at and updated_at in table and response body in specifications does not specify that
    const newInventoryId = result[0];
    const createdInventory = await knex("inventories")
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )
      .where({ id: newInventoryId });

res.status(201).json(createdInventory);
  } catch (error) {
  res.status(500).json({
    message: `Unable to create new warehouse: ${error}`,
  });
}
};

module.exports = {
  index,
  findOne,
  add,
};
