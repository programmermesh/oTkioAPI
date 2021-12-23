const { Subscription, validate } = require("../models/subscription");
const express = require("express");
const router = express.Router();

router.get("/userSubscription", async (req, res) => {
  const subscriptions = await Subscription.find()
    .populate("user", "first_name last_name _id")
    .select("-_id plan amount expiryDate user");
  res.send(subscriptions);
});

router.get("/", async (req, res) => {
  const subscription = await Subscription.find().sort("plan");
  res.send(subscription);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let subscription = new Subscription({
      plan: req.body.plan,
      amount: req.body.amount,
      expiryDate: req.body.expiryDate,
      user: req.body.user,
    });

    subscription = await subscription.save();
    res.send({
      subscription,
      responseCode: "00",
      responseDescription: "Subscription Successful",
    });
  } catch (ex) {
    console.log(ex.message);
  }
});

module.exports = router;
