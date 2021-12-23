const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const CostCenter = mongoose.model(
  "Cost_Center",
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

function validateCostCenter(costCenter) {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(costCenter);
}

exports.CostCenter = CostCenter;
exports.validateCostCenter = validateCostCenter;
