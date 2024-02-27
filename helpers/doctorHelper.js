const Boom = require("boom");
const db = require("../models");

const getDoctor = async (query) => {
  const result = await db.Doctor.findAll({
    where: {
      ...(query?.fullName && { fullName: query.fullName }),
      ...(query?.specialist && { specialist: query.specialist }),
    },
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "username", "email"],
      },
    ],
  });

  return Promise.resolve(result);
};

const createDoctor = async (doctor) => {
  const result = await db.Doctor.create({
    fullName: doctor?.fullName,
    specialist: doctor?.specialist,
    experience: doctor?.experience,
    alumnus: doctor?.alumnus,
    strId: doctor?.strId,
    userId: doctor?.userId,
    imageUrl: doctor?.imageUrl,
  });

  return Promise.resolve(result);
};

module.exports = {
  getDoctor,
  createDoctor,
};
