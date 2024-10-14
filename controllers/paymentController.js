require("dotenv").config();
const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../midleware/catchAsyncErrors");
const appoinmentModel = require("../modal/appointmentModal");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const { amount, appointmentId } = req.body;

    // Create a payment intent
    const myPayment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        company: "E-Learning",
      },
    });

    // Update appointment status in your database (this is an example)
    await appoinmentModel.findByIdAndUpdate(appointmentId, { payment: true });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

// Endpoint to get the Stripe API key
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_PUBLISHABLE_KEY });
  })
);

module.exports = router;
