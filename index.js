const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const warehousesRoutes = require('./routes/warehouses-routes');
const inventoriesRoutes = require('./routes/inventories-routes');

// Express middleware
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));
app.use((req, _res, next) => {
    next();

});

// // If you try to run the server, comment out the lines below

// const inventoryRoutes = require('./routes/inventory-routes');

// // Configuring warehouses endpoints
app.use('/api/warehouses', warehousesRoutes);
// // Configuring inventory endpoints
app.use('/api/inventories', inventoriesRoutes);

app.get('/', (_req, res) => {
    res.send('Welcome to InStock API');
  });

app.listen(PORT, function () {
    console.log(`Server is now listening at ${PORT}`);
});