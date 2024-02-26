const Boom = require("boom");
const db = require("../models");

const createDoctor = async (doctor) => {
  const result = await db.Doctor.create({
    fullname: doctor?.fullname,
    specialist: doctor?.specialist,
    experience: doctor?.experience,
    alumnus: doctor?.alumnus,
    imageUrl: doctor?.imageUrl,
    userId: doctor?.categoryId,
  });

  return Promise.resolve(result);
};

module.exports = {
  createDoctor,
};
