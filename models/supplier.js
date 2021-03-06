const Joi = require("joi");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const SupplierSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    email: {
      type: String,
      minlength: 3,
      trim: true,
    },
    country: {
      type: String,
      minlength: 3,
    },
    supplier_company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    main_contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Supplier_Category",
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = model("Supplier", SupplierSchema);

function validateSupplier(supplier) {
  const schema = Joi.object({
    email: Joi.string().min(3).email().required().label("Email"),
    supplier_company_name: Joi.string()
      .required()
      .label("Supplier Company Name"),
    company_name: Joi.string().required().label("Company Name"),
    country: Joi.string().required().label("Country"),
    category: Joi.string().required().label("Category"),
    userId: Joi.string().required().label("User ID"),
  });

  return schema.validate(supplier);
}

exports.Supplier = Supplier;
exports.validateSupplier = validateSupplier;
