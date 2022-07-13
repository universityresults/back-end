const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");

//  Routes
const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandsRoute = require("./routes/brandRoutes");
const productsRoute = require("./routes/productRoutes");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewares");

const app = express();

// allows to access routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

dotenv.config({ path: "./config.env" });

//connect with db
dbConnection();

// Middlewares
// to parse comming req
app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandsRoute);
app.use("/api/v1/products", productsRoute);

app.use("*", (req, res, next) => {
  // Creat error

  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handler
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("App running");
});

// Handel rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting down.....`);
    process.exit(1);
  });
});
