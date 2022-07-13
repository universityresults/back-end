const express = require("express");

const subCatController = require("../controllers/subCategoryControllers");

const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require("../utils/validators/subCategoryValidator");

// mergeParams allows you to access to parameters on other routers
// ex: we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  //
  .route("/")
  .post(
    //
    subCatController.setCategoryIdToBody,
    createSubCategoryValidator,
    subCatController.creatSubCategory
  )
  .get(subCatController.getSubCategories);
//
router
  //
  .route("/:id")
  .get(
    //
    getSubCategoryValidator,
    subCatController.getSubCategory
  )
  .put(
    //
    updateSubCategoryValidator,
    subCatController.updateSubCategory
  )
  .delete(
    //
    deleteSubCategoryValidator,
    subCatController.deleteSubCategory
  );
//

module.exports = router;
