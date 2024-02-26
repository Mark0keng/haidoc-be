const Joi = require("joi");
const Boom = require("boom");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.number().integer().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    concern: Joi.string().allow(""),
    consumption: Joi.string().required(),
    packaging: Joi.string().required(),
    manufacture: Joi.string().required(),
    categoryId: Joi.number().required(),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const doctorValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().required(),
    specialist: Joi.number().required(),
    experience: Joi.number().required(),
    alumnus: Joi.string().required(),
    strId: Joi.string().required(),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const addressValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    provinceId: Joi.number().disallow("").required().label("province"),
    cityId: Joi.number().disallow("").required().label("city"),
    fullAddress: Joi.string().allow(""),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const cartValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    productId: Joi.number().required(),
    count: Joi.number().required(),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const orderValidation = (data) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    grossAmount: Joi.number().required(),
    shippingCost: Joi.number().required(),
    userId: Joi.number().required(),
    status: Joi.string().required(),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const orderItemValidation = (data) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    productName: Joi.string().required(),
    productPrice: Joi.number().required(),
    count: Joi.number().required(),
    verifiedUser: Joi.object().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  doctorValidation,
  addressValidation,
  cartValidation,
  orderValidation,
  orderItemValidation,
};
