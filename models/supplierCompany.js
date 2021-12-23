const Joi = require("joi");
const mongoose = require("mongoose");

const SupplierCompany = mongoose.model(
  "SupplierCompany",
  new mongoose.Schema({
    email: {
      type: String,
      minlength: 3,
    },
    invitation: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
    company_buyer_name: {
      type: String,
    },
    buyerUserId: {
      type: String,
    },
    createdDate: { type: Date, default: Date.now },
  })
);

function validateSupplierCompany(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    company_buyer_name: Joi.string().required().label("Company Buyer Name"),
    buyerUserId: Joi.string().required().label("Company Buyer User ID"),
  });

  return schema.validate(user);
}

exports.SupplierCompany = SupplierCompany;
exports.validateSupplierCompany = validateSupplierCompany;
