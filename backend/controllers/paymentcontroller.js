const dotenv = require("dotenv");
const path = require("path");

// ✅ Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Stripe = require("stripe");

// ✅ Now safely use Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Process Payment
exports.processPayment = catchAsyncError(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Amount is required", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: "inr",
    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// ✅ Send Stripe API Key
exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
