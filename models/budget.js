const Joi = require("joi");
const mongoose = require("mongoose");

const Budget = mongoose.model(
  "Budget",
  new mongoose.Schema({
    costCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cost_Center",
    },
    budget: {
      type: Number,
    },
    createdDate: { type: Date, default: Date.now },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

function validateBudget(budget) {
  const schema = Joi.object({
    budget: Joi.number().required().label("budget"),
    costCenter: Joi.string().required().label("cost center"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(budget);
}

exports.Budget = Budget;
exports.validateBudget = validateBudget;
