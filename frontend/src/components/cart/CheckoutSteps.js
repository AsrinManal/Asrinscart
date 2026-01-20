import React from "react";


const CheckoutSteps = ({ activeStep }) => {
  const steps = ["Cart", "Shipping", "Confirm Order", "Payment"];

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index <= activeStep ? "active" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
