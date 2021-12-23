const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const Auction = mongoose.model(
  "Auction",
  new mongoose.Schema({
    auction: [
      {
        name: String,
        owner: String,
        description: String,
        cost_center: String,
        start_date: Date,
        end_date: Date,
        starting_price: String,
        currency: String,
        budget: String,
        minimum_step: String,
        cool_down_period: String,
        item: String,
        buyer_status: String,
        company_buyer_name: String,
        supplier_status: String,
        supplier_email: String,
      },
    ],
    link: {
      type: Array,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    documentPath: [
      {
        fileName: String,
        path: String,
      },
    ],
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
