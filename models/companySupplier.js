const Joi = require("joi");
const mongoose = require("mongoose");

const CompanySupplier = mongoose.model(
  "CompanySupplier",
  new mongoose.Schema({
    first_name: {
      type: String,
      minlength: 3,
    },
    last_name: {
      type: String,
      minlength: 3,
    },
    role: {
      type: String,
    },
    email: {
      type: String,
      minlength: 3,
    },
    company_name: {
      type: String,
      uppercase: true,
    },
    country: {
      type: String,
      uppercase: true,
    },
    status: {
      type: String,
    },
    isAdmin: Boolean,
    company_buyer_name: {
      type: String,
    },
    buyerUserId: {
      type: String,
    },
    isSeller: Boolean,
    isBuyer: Boolean,
    createdDate: { type: Date, default: Date.now },
  })
);

function validateCompanySupplier(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    company_buyer_name: Joi.string().required().label("Company Buyer Name"),
    buyerUserId: Joi.string().required().label("Company Buyer User ID"),
  });

  return schema.validate(user);
}

exports.CompanySupplier = CompanySupplier;
exports.validateCompanySupplier = validateCompanySupplier;
