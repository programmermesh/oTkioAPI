const Joi = require("joi");
const mongoose = require("mongoose");

const Attachment = mongoose.model(
  "Attachment",
  new mongoose.Schema({
    name: {
      type: String,
    },
    note: {
      type: String,
    },
    attachment: {
      fileName: String,
      path: String,
    },
    link: {
      type: String,
    },
    doc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doc",
    },
    createdDate: { type: Date, default: Date.now },
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

// function validateBudget(budget) {
//   const schema = Joi.object({
//     budget: Joi.number().required().label("budget"),
//     costCenter: Joi.string().required().label("cost center"),
//     companyId: Joi.string().required().label("companyId"),
//     userId: Joi.string().required().label("userId"),
//   });

//   return schema.validate(budget);
// }

exports.Attachment = Attachment;
// exports.validateBudget = validateBudget;
