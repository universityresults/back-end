const express = require("express");

const prodController = require("../controllers/productControllers");

const prodValidation = require("../utils/validators/productValidator");

const router = express.Router();

router
  //
  .route("/")
  .get(prodController.getProducts)
  .post(
    //
    prodController.uploadProductImages,
    prodController.handleProductImages,
    prodValidation.createProductValidator,
    prodController.creatProduct
  );

router
  //
  .route("/:id")
  .get(
    //
    prodValidation.getProductValidator,
    prodController.getProduct
  )
  .put(
    //
    prodController.uploadProductImages,
    prodController.handleProductImages,
    prodValidation.updateProductValidator,
    prodController.updateProduct
  )
  .delete(
    //
    prodController.deleteImages,
    prodValidation.deleteProductValidator,
    prodController.deleteProduct
  );

module.exports = router;
