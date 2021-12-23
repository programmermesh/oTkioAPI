const Joi = require("joi");
const mongoose = require("mongoose");

const Company = mongoose.model(
  "Company",
  new mongoose.Schema({
    image_upload: {
      type: String,
    },
    company_name: {
      type: String,
      uppercase: true,
    },
    country: {
      type: String,
      uppercase: true,
    },
    city: {
      type: String,
      uppercase: true,
    },
    address: {
      type: String,
      uppercase: true,
    },
    email: {
      type: String,
      uppercase: true,
    },
    website: {
      type: String,
      uppercase: true,
    },
    mobile: {
      type: String,
    },
    createdDate: { type: Date, default: Date.now },
  })
);

function validateCompany(company) {
  const schema = Joi.object({
    company_name: Joi.string().required().label("Company Name"),
    country: Joi.string().required().label("Country"),
    address: Joi.string().label("Address"),
    image_upload: Joi.string().label("Image"),
    email: Joi.string().label("Email"),
    city: Joi.string().label("City"),
    website: Joi.string().label("Website"),
    mobile: Joi.string().label("Mobile"),
  });

  return schema.validate(company);
}

exports.Company = Company;
exports.validateCompany = validateCompany;
