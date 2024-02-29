const Boom = require("boom");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Moment = require("moment");

const GeneralHelper = require("../helpers/generalHelper");

const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const fileName = "server/middlewares/authMiddleware.js";

// eslint-disable-next-line no-unused-vars
const validateToken = (request, reply, next) => {
  const { authorization } = request.headers;

  try {
    if (_.isEmpty(authorization)) {
      throw Boom.unauthorized();
    }

    const token = authorization.split(" ")[1];
    const verifiedUser = jwt.verify(token, jwtSecretToken);
    if (_.isEmpty(verifiedUser) || !_.has(verifiedUser, "exp")) {
      throw Boom.unauthorized();
    }

    const isTokenExpired = verifiedUser.exp < Moment().unix();
    if (isTokenExpired) {
      throw Boom.unauthorized();
    }

    request.body.verifiedUser = verifiedUser;

    return next();
  } catch (err) {
    console.log([fileName, "validateToken", "ERROR"], { info: `${err}` });
    console.log(err);
    return (
      reply
        // .status(err.output.statusCode)
        .send(GeneralHelper.errorResponse(err))
    );
  }
};

const isAdmin = (request, reply, next) => {
  try {
    if (request.body.verifiedUser.role !== 3) {
      throw Boom.forbidden();
    }

    return next();
  } catch (err) {
    console.log([fileName, "isAdmin", "ERROR"], { info: `${err}` });
    return reply
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

const isDoctor = (request, reply, next) => {
  try {
    if (request.body.verifiedUser.role !== 2) {
      throw Boom.forbidden();
    }

    return next();
  } catch (err) {
    console.log([fileName, "validateToken", "ERROR"], { info: `${err}` });
    return reply
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  validateToken,
  isAdmin,
  isDoctor,
};
