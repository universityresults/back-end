const express = require("express");

const brandController = require("../controllers/brandControllers");

const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../utils/validators/brandValidator");

const router = express.Router();

router
  //
  .route("/")
  .post(
    //
    brandController.uploadBrandImage,
    createBrandValidator,
    brandController.resize,
    brandController.creatBrand
  )
  .get(brandController.getBrands);

router
  //
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .put(
    //
    brandController.uploadBrandImage,
    updateBrandValidator,
    brandController.resize,
    brandController.updateBrand
  )
  .delete(
    //
    brandController.deleteImage,
    deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
