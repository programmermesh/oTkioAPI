const Joi = require("joi");
const mongoose = require("mongoose");

const BusinessUnit = mongoose.model(
  "Business_Unit",
  new mongoose.Schema({
    name: {
      type: String,
    },
    createdDate: { type: Date, default: Date.now },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

function validateBusinessUnit(businessUnit) {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(businessUnit);
}

exports.BusinessUnit = BusinessUnit;
exports.validateBusinessUnit = validateBusinessUnit;
