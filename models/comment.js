const Joi = require("joi");
const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    content: {
      type: String,
    },
    createdDate: { type: Date, default: Date.now },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    replyingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  })
);

function validateComment(comment) {
  const schema = Joi.object({
    content: Joi.string().required().label("content"),
    userId: Joi.string().required().label("userId"),
    replyingTo: Joi.string().label("replyingTo"),
  });

  return schema.validate(comment);
}

exports.Comment = Comment;
exports.validateComment = validateComment;
