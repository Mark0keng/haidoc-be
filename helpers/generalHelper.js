const Boom = require("boom");
const express = require("express");

const app = express();

const errorResponse = (error) => {
  if (
    error &&
    error.output &&
    error.output.payload &&
    error.output.payload.statusCode
  ) {
    const data =
      error.data && typeof error.data === "string" ? error.data : null;

    if (error.data && typeof error.data === "object") {
      switch (error.output.payload.statusCode) {
        case 400:
          return error;
        default:
          return Boom.badImplementation();
      }
    }

    switch (error.output.payload.statusCode) {
      case 422:
        return Boom.badData(error.output.payload.message, data);
      case 403:
        return Boom.forbidden(error.output.payload.message, data);
      case 404:
        return Boom.notFound(error.output.payload.message, data);
      case 400:
        return Boom.badRequest(error.output.payload.message, data);
      case 401:
        return Boom.unauthorized(error.output.payload.message, data);
      default:
        return Boom.badImplementation();
    }
  }

  return Boom.badImplementation();
};

const statusResponse = (error) => {
  if (
    error &&
    error.output &&
    error.output.payload &&
    error.output.payload.statusCode
  ) {
    const data =
      error.data && typeof error.data === "string" ? error.data : null;

    if (error.data && typeof error.data === "object") {
      switch (error.output.payload.statusCode) {
        case 400:
          return error;
        default:
          return Boom.badImplementation();
      }
    }

    switch (error?.output?.payload?.statusCode) {
      case 422:
        return 422;
      case 404:
        return 422;
      case 400:
        return 400;
      case 401:
        return 401;
      default:
        return 500;
    }
  }
};

const createTestServer = (path, plugin) => {
  // Middleware
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = async (data) => {
      res.send = oldSend; // set function back to avoid the 'double-send'
      const statusCode =
        (data.output && data.output.statusCode) || res.statusCode;
      let bodyResponse = data;

      if (statusCode !== 200 && data.isBoom) {
        bodyResponse = data.output.payload;
      }

      return res.status(statusCode).send(bodyResponse);
    };

    next();
  });

  app.use(path, plugin);

  return app.listen(null, () => {});
};

module.exports = {
  errorResponse,
  statusResponse,
  createTestServer,
};
