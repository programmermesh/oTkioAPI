const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    image_upload: {
      type: String,
    },
    first_name: {
      type: String,
      minlength: 3,
    },
    last_name: {
      type: String,
      minlength: 3,
    },
    position: {
      type: String,
    },
    role: {
      type: String,
    },
    isSeller: Boolean,
    isBuyer: Boolean,
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    business_unit: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      uppercase: true,
    },
    createdDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    isInvited: false,
    isVerified: false,
    confirmationCode: {
      type: String,
      unique: true,
    },
    isAdmin: Boolean,
    auctionId: {
      type: Array,
      minlength: 3,
    },
    company_buyer_name: {
      type: String,
    },
    buyerUserId: {
      type: String,
    },
    preferences: {
      language: {
        type: String,
      },
      timezone: {
        type: String,
      },
      currency: {
        type: String,
      },
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required().label("First Name"),
    last_name: Joi.string().min(3).required().label("Last Name"),
    role: Joi.string().required().label("Role"),
    email: Joi.string().required().email().label("Emaill"),
    password: Joi.string().required().label("Password"),
    company_name: Joi.string().required().label("Company Name"),
    country: Joi.string().required().label("Country"),
    status: Joi.string().label("Status"),
  });

  return schema.validate(user);
}

function validateCompanyTeamMembers(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required().label("First Name"),
    last_name: Joi.string().min(3).required().label("Last Name"),
    role: Joi.string().required().label("Role"),
    position: Joi.string().required().label("Position"),
    email: Joi.string().required().email().label("Emaill"),
    isAdmin: Joi.boolean().label("Admin user"),
    isSeller: Joi.boolean().label("Company seller"),
    isBuyer: Joi.boolean().label("Company buyer"),
  });
  return schema.validate(user);
}

function validateSeller(user) {
  const schema = Joi.object({
    auctionId: Joi.string().min(3).required().label("Auction ID"),
    email: Joi.string().required().email().label("Email"),
    buyerUserId: Joi.string().required().label("Buyer User ID"),
    company_buyer_name: Joi.string().required().label("Buyer Company Name"),
  });

  return schema.validate(user);
}

function validateCompanySupplier(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    buyerUserId: Joi.string().required().label("Company Buyer User ID"),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.validateSeller = validateSeller;
exports.validateCompanyTeamMembers = validateCompanyTeamMembers;
exports.validateCompanySupplier = validateCompanySupplier;
