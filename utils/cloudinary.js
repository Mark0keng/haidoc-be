const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (data, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    let uploadStream;

    if (data.buffer) {
      uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(data.buffer);
    } else {
      cloudinary.uploader
        .upload(data, {
          resource_type: resourceType,
          folder,
        })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    }
  });
};

const cloudinaryDeleteImg = async (publicId, resourceType) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response.result === "ok";
  } catch (error) {
    return false;
  }
};
module.exports = {
  uploadToCloudinary,
  cloudinaryDeleteImg,
};
