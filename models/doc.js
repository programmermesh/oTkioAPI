const Joi = require("joi");
const mongoose = require("mongoose");

const Doc = mongoose.model(
  "Doc",
  new mongoose.Schema({
    name: {
      type: String,
    },
    document: {
      fileName: String,
      path: String,
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

function validateDoc(doc) {
  console.log(doc);
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    // document: Joi.string().required().label("document"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(doc);
}

exports.Doc = Doc;
exports.validateDoc = validateDoc;
