const Boom = require("boom");
const db = require("../models");
const _ = require("lodash");
const path = require("path");
const { Op } = require("sequelize");

const { cloudinaryDeleteImg } = require("../utils/cloudinary");

const getAllProduct = async (query) => {
  const result = await db.Product.findAndCountAll({
    where: {
      ...(query?.name && {
        name: { [Op.like]: `%${query.name}%` },
      }),
      ...(query?.category && {
        category: query.category,
      }),
    },
    limit: query.limit && Number(query.limit),
    offset: query.page && Number(query.page) * Number(query.limit),
    order: [["createdAt", "DESC"]],
  });

  if (_.isEmpty(result)) {
    return Promise.reject(Boom.notFound("Product Not Found"));
  }

  return Promise.resolve(result);
};

const getProductById = async (id) => {
  const result = await db.sequelize.transaction(async (t) => {
    const product = await db.Product.findOne({
      where: { id },
    });

    return product;
  });

  if (_.isEmpty(result)) {
    return Promise.reject(Boom.notFound("Product Not Found"));
  }

  return Promise.resolve(result);
};

const createProduct = async (product) => {
  const result = await db.Product.create({
    name: product?.name,
    price: product?.price,
    description: product?.description,
    concern: product?.concern,
    consumption: product?.consumption,
    packaging: product?.packaging,
    manufacture: product?.manufacture,
    imageUrl: product?.imageUrl,
    category: product?.category,
    stock: product?.stock,
  });

  return Promise.resolve(result);
};

const updateProduct = async (product, id) => {
  const result = await sequelize.transaction(async (t) => {
    const productData = await db.Product.update(
      {
        name: product?.name,
        price: product?.price,
        description: product?.description,
        concern: product?.concern,
        consumption: product?.consumption,
        packaging: product?.packaging,
        manufacture: product?.manufacture,
        imageUrl: product?.imageUrl && product.imageUrl,
        category: product?.category,
        stock: product?.stock,
      },
      { where: { id } },
      { transaction: t }
    );

    return productData;
  });

  return Promise.resolve(result);
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);

  const urlObject = new URL(product.imageUrl);
  const publicId = path.basename(
    urlObject.pathname,
    path.extname(urlObject.pathname)
  );

  if (publicId) {
    await cloudinaryDeleteImg(publicId, "image");
  }

  await db.Product.destroy({ where: { id } });
};

module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
