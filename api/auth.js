const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const Validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const GeneralHelper = require("../helpers/generalHelper");
const { decryptTextPayload } = require("../utils/decryptPayload");

const getProfile = async (request, reply) => {
  try {
    const data = await AuthHelper.getProfile(request.query);

    return reply.send(data);
  } catch (err) {
    return reply
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

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
    let { credential, password } = request.body;
    credential = decryptTextPayload(credential);
    password = decryptTextPayload(password);

    Validation.loginValidation({ credential, password });

    const response = await AuthHelper.login({ credential, password });

    return reply.send(response);
  } catch (err) {
    return reply
      .status(GeneralHelper.statusResponse(err))
      .send(GeneralHelper.errorResponse(err));
  }
};

const getEmailForgotPassword = async (request, reply) => {
  try {
    Validation.forgotPasswordValidation(request.body);

    const { email } = request.body;

    const response = await AuthHelper.getEmailForgotPassword(email);

    return reply.send(response);
  } catch (err) {
    console.log(err);
    return reply.status(500).send(GeneralHelper.errorResponse(err));
  }
};

const changeForgotPassword = async (request, reply) => {
  try {
    Validation.changeForgotPasswordValidation(request.body);

    const response = await AuthHelper.changeForgotPassword(request.body);

    return reply.send(response);
  } catch (err) {
    console.log(err);
    return reply
      .status(err.output.statusCode)
      .send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/get-profile", getProfile);
Router.post("/register", register);
Router.post("/login", login);
Router.post("/forgot-password", getEmailForgotPassword);
Router.post("/forgot-password/change", changeForgotPassword);

module.exports = Router;
