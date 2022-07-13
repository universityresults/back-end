const express = require("express");

const catController = require("../controllers/categoryControllers");

const validator = require("../utils/validators/cateValidators");

const router = express.Router();

const subCategoryRoutes = require("./subCategoryRoutes");

router.use("/:catId/subcategory", subCategoryRoutes);

router
  //
  .route("/")
  .get(catController.getCategories)
  .post(
    //
    catController.uploadCategoryImage,
    validator.createCategoryValidator,
    catController.resize,
    catController.creatCategory
  );

router
  //
  .route("/:id")
  .get(validator.getCategoryValidator, catController.getCategory)
  .put(
    //
    catController.uploadCategoryImage,
    validator.updateCategoryValidator,
    catController.resize,
    catController.updateCategory
  )
  .delete(
    //
    catController.deleteImage,
    validator.deleteCategoryValidator,
    catController.deleteCategory
  );

module.exports = router;
