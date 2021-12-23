const jwt = require("jsonwebtoken");
const Joi = require("Joi");
const _ = require("lodash");
const { transporter } = require("../middleware/sendEmail");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  }).populate({ path: "company", select: "company_name" });
  if (!user)
    return res.status(400).send({
      responseCode: "03",
      responseDescription: "Invalid email or password.",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      responseCode: "03",
      responseDescription: "Invalid email or password.",
    });

  if (user.status === "Pending")
    return res.status(400).send({
      responseCode: "99",
      responseDescription: "Kindly activate your account",
    });

  user = _.pick(user, [
    "_id",
    "first_name",
    "last_name",
    "status",
    "email",
    "role",
    "isAdmin",
    "isSeller",
    "isBuyer",
    "company",
  ]);

  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY
  );
  res.send({
    user,
    token,
  });
});

router.patch("/resetPassword", async (req, res) => {
  const { error } = resetvalidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return res.status(400).send({
      responseCode: "03",
      responseDescription: "Invalid email",
    });

  const validPassword = await bcrypt.compare(
    req.body.old_password,
    user.password
  );

  if (!validPassword)
    return res.status(400).send({
      responseCode: "03",
      responseDescription: "Invalid password.",
    });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.new_password, salt);

  await user.save();

  res.send({
    responseCode: "00",
    responseDescription: "Password reset succesfully",
  });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Emaill"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(req);
}

function resetvalidate(req) {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Emaill"),
    old_password: Joi.string().required().label("Old Password"),
    new_password: Joi.string().required().label("New Password"),
  });

  return schema.validate(req);
}

module.exports = router;
