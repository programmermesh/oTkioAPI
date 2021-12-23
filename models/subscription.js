const Joi = require("joi");
const user = require("./user.js");
const mongoose = require("mongoose");

const Subscription = mongoose.model(
  "Subscription",
  new mongoose.Schema({
    plan: {
      type: ["Basic", "Silver", "Gold", "Premium"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    createdDate: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);

function validateSubscription(subscription) {
  const schema = Joi.object({
    plan: Joi.string()
      .required()
      .label("Plan")
      .valid("Basic", "Silver", "Gold", "Premium"),
    amount: Joi.number().required().label("Amount"),
    expiryDate: Joi.string().required().label("Expiry Date"),
    user: Joi.string().required().label("userID"),
  });

  return schema.validate(subscription);
}

exports.Subscription = Subscription;
exports.validate = validateSubscription;
