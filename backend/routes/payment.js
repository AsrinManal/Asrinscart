const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentcontroller"); // 👈 lowercase

router.post("/payment/process", processPayment);
router.get("/stripeapikey", sendStripeApiKey);

module.exports = router;
