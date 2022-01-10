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
    status: {
      type: String,
      default: "Published",
    },
    uploads: [
      {
        fileName: String,
        path: String,
      },
    ],
    docs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doc",
      },
    ],
    links: [String],
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    suppliers: [
      {
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supplier",
        },
        status: {
          type: String,
          enum: ["Accepted", "Rejected", "Participated", "Pending"],
          default: "Pending",
        },
        starting_price: {
          type: Number,
        },
        bonus_malus_percent: {
          type: Number,
        },
        bonus_malus_amount: {
          type: Number,
        },
        final_bid: {
          type: Number,
          default: 0,
        },
        named_items: [
          {
            item: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Item",
            },
            quantity: Number,
          },
        ],
        bids: [
          {
            index: Number,
            amount: Number,
          },
        ],
      },
    ],
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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  })
);

function validateAuction(auction) {
  const schema = Joi.object({
    projectId: Joi.string().required().label("ProjectId"),
    auction_type: Joi.string().required().label("Auction type"),
    auction_name: Joi.string().required().label("Auction name"),
    description: Joi.string().required().label("Description"),
    startDate: Joi.date().required().label("Start date"),
    endDate: Joi.date().required().label("End date"),
    starting_price: Joi.number().required().label("Starting price"),
    minimum_step: Joi.number().required().label("Minimum step"),
    currency: Joi.string().required().label("Currency"),
    cost_center: Joi.string().required().label("Cost center"),
    budget: Joi.string().required().label("Budget"),
    cool_down: Joi.number().required().label("Cool down period"),
    awarding_commitment: Joi.boolean().required().label("Awarding commitment"),
    show_to_supplier: Joi.boolean().required().label("Show to supplier"),
    reserve_price: Joi.number().required().label("Reserve price"),
    number_of_participants: Joi.string()
      .required()
      .label("Number of participants"),
    disclose_suppliers_bid: Joi.boolean()
      .required()
      .label("Disclose suppliers bid"),
    disclose_suppliers_name: Joi.boolean()
      .required()
      .label("Disclose supliers name"),
    disclose_starting_price: Joi.boolean()
      .required()
      .label("Disclose starting price"),
    items: Joi.array().items(Joi.string()).required().label("Items"),
    suppliers: Joi.array().items(Joi.string()).required().label("Suppliers"),
    docs: Joi.array().items(Joi.string()).required().label("Document"),
    links: Joi.array().items(Joi.string()).optional().label("Links"),
    companyId: Joi.string().required().label("CompanyId"),
  });

  return schema.validate(auction);
}

exports.Auction = Auction;
exports.validateAuction = validateAuction;
