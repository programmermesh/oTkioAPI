const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const Tag = mongoose.model(
  "Tag",
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

function validateTag(tag) {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(tag);
}

exports.Tag = Tag;
exports.validateTag = validateTag;
