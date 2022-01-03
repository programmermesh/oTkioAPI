const Joi = require("joi");
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  item_name: {
    type: String,
  },
  itemId: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  notes: {
    type: String,
  },
  unit: {
    type: String,
  },
  category: {
    type: String,
  },
  model: {
    type: String,
  },
  tagss: {
    type: String,
  },
  image_upload: {
    type: String,
  },
  document: [
    {
      fileName: String,
      path: String,
    },
  ],
  link: {
    type: String,
  },
  status: {
    type: String,
  },
  company_name: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

ItemSchema.index({ item_name: 'text' })

const Item = mongoose.model("Item", ItemSchema);

function validateItem(item) {
  const schema = Joi.object({
    itemId: Joi.string().required().label("Item ID"),
    item_name: Joi.string().required().label("Item Name"),
    manufacturer: Joi.string().required().label("Manufacturer"),
    notes: Joi.string().required().label("Notes"),
    unit: Joi.string().required().label("Unit"),
    category: Joi.string().required().label("Category"),
    model: Joi.string().required().label("Model"),
    status: Joi.string().required().label("Status"),
    group: Joi.string().required().label("Group"),
    tagss: Joi.string().label("tags"),
    company_name: Joi.string().label("Company Name"),
    image_upload: Joi.string().label("Image"),
    link: Joi.string().label("Link"),
    documents: Joi.string().label("Documents"),
    userId: Joi.string().required().label("UserID"),
  });

  return schema.validate(item);
}

exports.Item = Item;
exports.validateItem = validateItem;
