const Boom = require("boom");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const db = require("../models");
const { sendEmail } = require("../utils/nodemailer");
const GeneralHelper = require("../helpers/generalHelper");
const { decryptTextPayload } = require("../utils/decryptPayload");

const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "super_strong_key";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
const salt = bcrypt.genSaltSync(10);

const __hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const __comparePassword = (payloadPass, dbPass) => {
  return bcrypt.compareSync(payloadPass, dbPass);
};

const __generateToken = (data) => {
  return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
};

const registerUser = async (dataObject) => {
  const { username, email, password, role } = dataObject;

  try {
    const user = await db.User.findOne({
      where: { email },
    });
    if (!_.isEmpty(user)) {
      return Promise.reject(Boom.badRequest("EMAIL_HAS_BEEN_USED"));
    }

    const hashedPass = __hashPassword(password);
    await db.User.create({ username, email, password: hashedPass, role });

    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const login = async (dataObject) => {
  let { email, password } = dataObject;

  try {
    const user = await db.User.findOne({
      where: { email },
    });

    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("USER_NOT_FOUND"));
    }

    const isPassMatched = __comparePassword(password, user.password);
    if (!isPassMatched) {
      return Promise.reject(Boom.badRequest("WRONG_CREDENTIALS"));
    }

    const token = __generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return Promise.resolve({ token });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

// const changePassword = async (email, oldPassword, newPassword) => {
//   try {
//     const user = await db.User.findOne({
//       where: {
//         email,
//       },
//     });

//     const isPassMatched = __comparePassword(oldPassword, user.password);
//     if (!isPassMatched) {
//       return Promise.reject(Boom.badRequest("WRONG_CREDENTIALS"));
//     }

//     await db.User.update(
//       { password: __hashPassword(newPassword) },
//       {
//         where: {
//           email,
//         },
//       }
//     );

//     return Promise.resolve({ message: "Successfully change password" });
//   } catch (err) {
//     return Promise.reject(GeneralHelper.errorResponse(err));
//   }
// };

const getEmailForgotPassword = async (email) => {
  try {
    const user = await db.User.findOne({
      where: {
        email,
      },
    });
    if (_.isEmpty(user)) {
      return Promise.reject(Boom.notFound("ACCOUNT_NOT_FOUND"));
    }

    const currentTime = new Date();
    const expiresIn = currentTime.setHours(currentTime.getHours() + 24);

    const tokenExist = await db.ForgotPassword.findOne({
      where: {
        userId: user.id,
      },
    });

    const token = uuidv4();

    let forgotPassword;

    if (_.isEmpty(tokenExist)) {
      forgotPassword = await db.ForgotPassword.create({
        token,
        expiresIn,
        userId: user.id,
      });
    } else {
      forgotPassword = await db.ForgotPassword.update(
        { token, expiresIn },
        {
          where: {
            userId: user.id,
          },
        }
      );
    }

    sendEmail({
      to: user.email,
      subject: "Ganti Password",
      text: `Berikut link ini untuk mengganti password Anda, link ini bersifat privasi jangan disebarkan.\n
      http://localhost:3000/forgot-password/change/${token}\n
      Link ini bertahan selam 24 jam.`,
      html: `<p>Berikut link ini untuk mengganti password Anda, link ini bersifat privasi jangan disebarkan.</p>
    <a href="http://localhost:3000/forgot-password/change/${token}">http://localhost:3000/forgot-password/change/${token}</a>
      <p>Link ini bertahan selam 24 jam.</p>`,
    });

    return Promise.resolve({
      message: "Email sudah dikirim, silahkan cek email Anda!",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const changeForgotPassword = async (data) => {
  let { token, password, confirmPassword } = data;

  password = decryptTextPayload(password);
  confirmPassword = decryptTextPayload(confirmPassword);

  console.log(password, confirmPassword, "<<<< log");

  if (password !== confirmPassword) {
    return Promise.reject(
      Boom.badRequest("Password and confirm password not same, try again!")
    );
  }

  const tokenData = await db.ForgotPassword.findOne({
    where: {
      token,
    },
  });
  if (_.isEmpty(tokenData)) {
    return Promise.reject(Boom.notFound("TOKEN_NOT_VALID"));
  }

  const currentTime = new Date();
  const expireTime = new Date(tokenData.expiresIn);

  if (currentTime > expireTime) {
    return Promise.reject(Boom.badRequest("TOKEN_EXPIRED"));
  }

  await db.User.update(
    { password: __hashPassword(password) },
    {
      where: {
        id: tokenData.userId,
      },
    }
  );

  await db.ForgotPassword.destroy({
    where: {
      id: tokenData.id,
    },
  });

  return Promise.resolve({
    message: "Change password successful",
  });
};

const getProfile = async (id) => {
  const result = await db.User.findOne({
    where: {
      id,
    },
  });

  if (_.isEmpty(result)) {
    return Promise.reject(Boom.notFound("User Not Found"));
  }

  return Promise.resolve(result);
};

module.exports = {
  __hashPassword,
  registerUser,
  login,
  getProfile,
  getEmailForgotPassword,
  changeForgotPassword,
};
