const Router = require("express").Router();
const Boom = require("boom");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  uploadToCloudinary,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const Validation = require("../helpers/validationHelper");
const DoctorHelper = require("../helpers/doctorHelper");
const GeneralHelper = require("../helpers/generalHelper");
const uploadMedia = require("../middlewares/uploadMedia");

const getDoctor = async (req, res) => {
  try {
    const data = await DoctorHelper.getDoctor(req.query);

    return res.status(200).json({ message: "Successfully get data", data });
  } catch (err) {
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const createDoctor = async (req, res) => {
  let imageResult;
  try {
    if (req?.fileValidationError)
      throw Boom.badRequest(req.fileValidationError.message);

    if (!req?.files?.imageUrl) throw Boom.badRequest("Image is required");

    Validation.doctorValidation(req.body);

    imageResult = await uploadToCloudinary(req.files.imageUrl[0], "image");

    if (!imageResult?.url) throw Boom.badImplementation(imageResult.error);

    const response = await DoctorHelper.createDoctor({
      ...req.body,
      imageUrl: imageResult?.url,
    });

    return res
      .status(200)
      .json({ message: "Doctor successfully created", data: response });
  } catch (err) {
    if (imageResult?.public_id) {
      await cloudinaryDeleteImg(imageResult.public_id, "image");
    }
    console.log(err);
    return res.status(500).send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/", getDoctor);
Router.post(
  "/create",
  authMiddleware.validateToken,
  uploadMedia.fields([{ name: "imageUrl", maxCount: 1 }]),
  createDoctor
);

module.exports = Router;
