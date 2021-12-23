const Joi = require("joi");
const mongoose = require("mongoose");

const SupplierCategory = mongoose.model(
  "Supplier_Category",
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

function validateSupplierCategory(supplierCategory) {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(supplierCategory);
}

exports.SupplierCategory = SupplierCategory;
exports.validateSupplierCategory = validateSupplierCategory;
