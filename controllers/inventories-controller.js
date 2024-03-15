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

// DELETE an Inventory Item
const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();
    if (rowsDeleted === 0) {
      // Checking if the inventory item exists
      return res.status(404).json({ message: "Inventory ID not found" });
    }
    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.sratus(500).json({ message: "Unable to delete inventory item" });
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

    //define as we need to convert string quantity to int as that's what specifications input and output were
    const {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity
    } = req.body;

    const newInventory = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity: parseInt(quantity)
  }

    //add inventory and display the inventory item
    const result = await knex("inventories").insert(newInventory);

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
      .where({ id: newInventoryId })
      .first();

    res.status(201).json(createdInventory);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${error}`,
    });
  }
};

// PUT/EDIT an Inventory Item
const update = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } = req.body;
  try {
    // Checking if the inventory item with the specified ID exists
    const existingInventory = await knex("inventories").where({ id: req.params.id }).first();
    if (!existingInventory) {
      return res.status(404).json({ message: "Inventory ID not found" });
    }
    // Validating the request body for missing properties
    if (!warehouse_id || !item_name || !description || !category || !status || !quantity) {
      return res.status(400).json({ message: "Missing properties in the request body" });
    }
    // Checking if the warehouse_id value exists in the warehouses table
    const existingWarehouse = await knex("warehouses").where({ id: warehouse_id }).first();
    if (!existingWarehouse) {
      return res.status(400).json({ message: "Warehouse is not selected. Please select the warehouse from the dropdown list." });
    }
    // Validating the format of the quantity
    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number" });
    }
    // Updating the inventory item in the database
    await knex("inventories").where({ id: req.params.id }).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity
    });
    // Retrieving the updated inventory item from the database
    const updatedInventory = await knex("inventories").where({ id: req.params.id }).first();
    // Returning the updated inventory item in the response
    res.status(200).json(updatedInventory);
  } catch (error) {
    // Handling errors
    console.error("Error updating inventory:", error);
    res.status(500).json({ message: "Unable to update inventory item" });
  }
};

module.exports = {
  index,
  findOne,
  update,
  remove,
  add,
};
