const asyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const { clearImage } = require("../helpers/clearImage");

exports.DeleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.UpdateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, title } = req.body;

    if (title) {
      req.body.slug = slugify(title);
    }
    if (name) {
      req.body.slug = slugify(name);
    }

    const document = await Model.findByIdAndUpdate(
      //
      id,
      req.body,
      { new: true }
    );

    if (!document) {
      const err = res.json(new ApiError(`No Document Found in This ID:${id}`, 404));
      return next(err);
    }

    res.status(201).json({
      message: "Update Document Succeed",
      data: document,
    });
  });

exports.CreateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { name, title } = req.body;

    if (title) {
      req.body.slug = slugify(title);
    } else {
      req.body.slug = slugify(name);
    }

    const newDocument = await Model.create(req.body);

    res.status(201).json({
      message: "New Document Created",
      data: newDocument,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      const err = res.json(new ApiError("No Document Found", 404));
      return next(err);
    }

    res.status(200).json({
      message: "Getting Document Succeed",
      data: document,
    });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filterObject = {};
    if (req.params.catId) filterObject = { category: req.params.catId };
    req.filterObj = filterObject;

    // build query
    const docCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObject), req.query)
      //
      .paginate(docCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResults } = apiFeatures;

    const documents = await mongooseQuery;

    res.status(200).json({
      message: "Getting Documents Succeed",
      results: documents.length,
      paginationResults,
      data: documents,
    });
  });

exports.deleteOneImage = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const imageUrl = await Model.findById(id).select("image");

    const filePath = imageUrl.image.split(`${process.env.BASE_URL}/`);

    clearImage(`uploads/${filePath[1]}`);

    next();
  });

exports.deleteMultipleImages = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const imagesUrl = await Model.findById(id).select("imageCover images -_id -category");

    const coverPath = imagesUrl.imageCover.split(`${process.env.BASE_URL}/`);

    const imagesPath = [];

    imagesUrl.images.forEach((image) => {
      const path = image.split(`${process.env.BASE_URL}/`);
      imagesPath.push(path);
    });

    imagesPath.forEach((image) => {
      clearImage(`uploads/${image[1]}`);
    });

    clearImage(`uploads/${coverPath[1]}`);

    next();
  });
