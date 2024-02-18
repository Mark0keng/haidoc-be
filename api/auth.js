const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const GeneralHelper = require("../helpers/generalHelper");

const register = async (request, reply) => {
  try {
    Validation.registerValidation(request.body);

    const { username, email, password, role } = request.body;
    const response = await AuthHelper.registerUser({
      username,
      email,
      password,
      role,
    });

    return reply.send(response);
  } catch (err) {
    console.log(err);
    return reply
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

const login = async (request, reply) => {
  try {
    Validation.loginValidation(request.body);

    const { email, password } = request.body;
    const response = await AuthHelper.login({ email, password });

    return reply.send(response);
  } catch (err) {
    return reply
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.post("/register", register);
Router.post("/login", login);

module.exports = Router;
