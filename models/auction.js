const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const Auction = mongoose.model(
  "Auction",
  new mongoose.Schema({
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    auction_type: {
      type: String,
    },
    auction_name: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    starting_price: {
      type: Number,
    },
    minimum_step: {
      type: Number,
    },
    currency: {
      type: String,
    },
    cost_center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cost_Center",
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
    },
    cool_down: {
      type: Number,
    },
    awarding_commitment: {
      type: Boolean,
    },
    show_to_supplier: {
      type: String,
    },
    reserve_price: {
      type: Number,
    },
    number_of_participants: {
      type: String,
    },
    disclose_suppliers_bid: {
      type: Boolean,
    },
    disclose_suppliers_name: {
      type: Boolean,
    },
    disclose_starting_price: {
      type: Boolean,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

function validateAuction(auction) {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    owner: Joi.string().required().label("Owner"),
    description: Joi.string().required().label("Description"),
    start_date: Joi.string().required().label("Start Date"),
    end_date: Joi.string().required().label("End Date"),
    starting_price: Joi.string().required().label("Starting price"),
    cost_center: Joi.string().required().label("Cost center"),
    currency: Joi.string().required().label("Currency"),
    budget: Joi.string().required().label("Budget"),
    minimum_step: Joi.string().required().label("Minimum step"),
    cool_down_period: Joi.string().required().label("Cool down period"),
    item: Joi.string().required().label("Item"),
    link: Joi.array().required().label("Link"),
    suppliers_email: Joi.array().required().label("Suppliers email"),
    buyer_status: Joi.string().required().label("Buyer status"),
    supplier_status: Joi.string().required().label("Supplier status"),
    company_buyer_name: Joi.string().required().label("Company Buyer name"),
    userId: Joi.string().required().label("UserID"),
  });

  return schema.validate(auction);
}

exports.Auction = Auction;
exports.validateAuction = validateAuction;
