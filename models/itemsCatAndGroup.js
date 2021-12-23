const Joi = require("joi");
const mongoose = require("mongoose");

const ItemsCatAndGroup = mongoose.model(
  "Items_Cat_And_Group",
  new mongoose.Schema({
    name: {
      type: String,
    },
    itemType: {
      type: String,
      enum: ["category", "group"],
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

function validateItemsCatAndGroup(itemsCatAndGroup) {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    itemType: Joi.string().required().label("itemType"),
    companyId: Joi.string().required().label("companyId"),
    userId: Joi.string().required().label("userId"),
  });

  return schema.validate(itemsCatAndGroup);
}

exports.ItemsCatAndGroup = ItemsCatAndGroup;
exports.validateItemsCatAndGroup = validateItemsCatAndGroup;
