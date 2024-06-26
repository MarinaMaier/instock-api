const knex = require("knex")(require("../knexfile"));

//fields to select for warehouse
const warehouseAttr = [
  "id",
  "warehouse_name",
  "address",
  "city",
  "country",
  "contact_name",
  "contact_position",
  "contact_phone",
  "contact_email",
];

//get list of warehouses
const index = async (_req, res) => {
  try {
    const data = await knex("warehouses").select(warehouseAttr);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving warehouses: ${err}`);
  }
};

//get one warehouse
const findOne = async (req, res) => {
  try {
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .select(warehouseAttr)
      .first();
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.status(200).json(warehouse);
  } catch (err) {
    res.status(500).send(`Error retrieving warehouses: ${err}`);
  }
};

//update one warehouse with new input data
const update = async (req, res) => {
  try {
    const requiredFields = [
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email",
    ];

    //confirm fields are not empty and phone and email conditions are met
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `invalid input: ${field} was null or empty`,
        });
      }
    }

    const validPhoneNumberRegex =
      /^[\+]?[0-9]*\ *[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!validPhoneNumberRegex.test(req.body.contact_phone)) {
      return res.status(400).json({
        message: `invalid input - contact_phone: '${req.body.contact_phone}' is formatted incorrectly, please use '+<intl-code> (<area-code>) abc-wxyz' format`,
      });
    }

    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailRegex.test(req.body.contact_email)) {
      return res.status(400).json({
        message: `invalid input - contact_email: '${req.body.contact_email}' is formatted incorrectly, please use '<example-email>@<example-domain>.<example-suffix>' format`,
      });
    }

    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update(req.body);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.id} not found`,
      });
    }

    const updatedwarehouse = await knex("warehouses")
      .where({
        id: req.params.id,
      })
      .select(warehouseAttr)
      .first();

    res.json(updatedwarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse with ID ${req.params.id}: ${error}`,
    });
  }
};

const inventories = async (req, res) => {
  try {
    // Check if the warehouse ID exists
    const warehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .select(warehouseAttr)
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
      .where({ warehouse_id: req.params.id })
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    res.json(inventories);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventories for warehouse with ID ${req.params.id}: ${error}`,
    });
  }
};

//delete warehouse 
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
      message: `Unable to delete warehouse: ${error}`,
    });
  }
};

//add a new warehouse 
const add = async (req, res) => {
  try {
    const requiredFields = [
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email",
    ];

    //if warehouse fields are empty or phone or email does not meet condition, return error
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `invalid input: ${field} was null or empty`,
        });
      }
    }

    const validPhoneNumberRegex =
      /^[\+]?[0-9]*\ *[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!validPhoneNumberRegex.test(req.body.contact_phone)) {
      return res.status(400).json({
        message: `invalid input - contact_phone: '${req.body.contact_phone}' is formatted incorrectly, please use '+<intl-code> (<area-code>) abc-wxyz' format`,
      });
    }

    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailRegex.test(req.body.contact_email)) {
      return res.status(400).json({
        message: `invalid input - contact_email: '${req.body.contact_email}' is formatted incorrectly, please use '<example-email>@<example-domain>.<example-suffix>' format`,
      });
    }

    const result = await knex("warehouses").insert(req.body);

    const newWarehousesId = result[0];
    const createdwarehouse = await knex("warehouses")
      .where({ id: newWarehousesId })
      .select(warehouseAttr)
      .first();

    res.status(201).json(createdwarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${error}`,
    });
  }
};

module.exports = {
  index,
  findOne,
  update,
  inventories,
  remove,
  add,
};
