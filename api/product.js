const Router = require("express").Router();
const Boom = require("boom");
const path = require("path");

const authMiddleware = require("../middlewares/authMiddleware");

const Validation = require("../helpers/validationHelper");
const ProductHelper = require("../helpers/productHelper");
const GeneralHelper = require("../helpers/generalHelper");
const {
  uploadToCloudinary,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const uploadMedia = require("../middlewares/uploadMedia");

const getAllProduct = async (req, res) => {
  try {
    const data = await ProductHelper.getAllProduct(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const getProductById = async (req, res) => {
  try {
    const data = await ProductHelper.getProductById(req.params.id);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    console.log(err);
    return res
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const createProduct = async (req, res) => {
  let imageResult;
  try {
    if (req?.fileValidationError)
      throw Boom.badRequest(req.fileValidationError.message);

    if (!req?.files?.imageUrl) throw Boom.badRequest("Image is required");

    Validation.productValidation(req.body);

    imageResult = await uploadToCloudinary(req.files.imageUrl[0], "image");

    if (!imageResult?.url) throw Boom.badImplementation(imageResult.error);

    const response = await ProductHelper.createProduct({
      ...req.body,
      imageUrl: imageResult?.url,
    });

    return res
      .status(201)
      .json({ message: "Product successfully created", data: response });
  } catch (err) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, "image");
    }
    return res
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

const updateProduct = async (req, res) => {
  let imageResult;
  try {
    const product = await ProductHelper.getProductById(req.params.id);

    if (req?.fileValidationError)
      throw Boom.badRequest(req.fileValidationError.message);

    if (req.files?.imageUrl) {
      const urlObject = new URL(product.imageUrl);
      const publicId = path.basename(
        urlObject.pathname,
        path.extname(urlObject.pathname)
      );
      if (publicId) {
        await cloudinaryDeleteImg(publicId, "image");
      }

      imageResult = await uploadToCloudinary(req.files.imageUrl[0], "image");
      if (!imageResult?.url) throw Boom.badImplementation(imageResult.error);
    }

    Validation.productValidation(req.body);

    const data = await ProductHelper.updateProduct(
      { ...req.body, imageUrl: imageResult?.url },
      req.params.id
    );

    return res
      .status(200)
      .json({ message: "Product successfully updated", data });
  } catch (err) {
    return res
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

const deleteProduct = async (req, res) => {
  try {
    const data = await ProductHelper.deleteProduct(req.params.id);

    return res
      .status(200)
      .json({ message: "Product Successfully Deleted", data });
  } catch (err) {
    return res
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", getAllProduct);
Router.get("/:id", getProductById);
Router.post(
  "/create",
  uploadMedia.fields([{ name: "imageUrl", maxCount: 1 }]),
  authMiddleware.validateToken,
  authMiddleware.isAdmin,
  createProduct
);
Router.put(
  "/update/:id",
  uploadMedia.fields([{ name: "imageUrl", maxCount: 1 }]),
  authMiddleware.validateToken,
  authMiddleware.isAdmin,
  updateProduct
);
Router.delete(
  "/delete/:id",
  authMiddleware.validateToken,
  authMiddleware.isAdmin,
  deleteProduct
);

module.exports = Router;
