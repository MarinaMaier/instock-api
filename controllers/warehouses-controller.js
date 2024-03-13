const knex = require("knex")(require("../knexfile"));

const index = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving warehouses: ${err}`);
  }
};

const findOne = async (req, res) => {
  try {
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.status(200).json({
      id: warehouse.id,
      warehouse_name: warehouse.warehouse_name,
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      contact_name: warehouse.contact_name,
      contact_position: warehouse.contact_position,
      contact_phone: warehouse.contact_phone,
      contact_email: warehouse.contact_email,
    });
  } catch (err) {
    res.status(500).send(`Error retrieving warehouses: ${err}`);
  }
};

const update = async (req, res) => {
  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.id} not found`,
      });
    }

    const updatedwarehouse = await knex("warehouses").where({
      id: req.params.id,
    });

    res.json(updatedwarehouse[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse with ID ${req.params.id}: ${error}`
    });
  }
};

const inventories = async (req, res) => {
  try {
    // Check if the warehouse ID exists
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();

    if (!warehouse) {
      // If warehouse doesn't exist, return 404 response
      return res
        .status(404)
        .json({ message: `Warehouse with ID: ${req.params.id} not found` });
    }

    // Warehouse exists, proceed to fetch inventories
    const inventories = await knex("warehouses")
      .join("inventories", "inventories.warehouse_id", "warehouses.id")
      .where({ warehouse_id: req.params.id });

    res.json(inventories);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventories for warehouse with ID ${req.params.id}: ${error}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `warehouses with ID ${req.params.id} not found` });
    }

    // No Content response
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete user: ${error}`,
    });
  }
};

module.exports = {
  index,
  findOne,
  update,
  inventories,
  remove,
  update,
};
