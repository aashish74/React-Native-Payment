const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8080;

const stripe = require('stripe')('sk_test_51QNuLJHloYzfCwKQAUfUEKupYlUCbAOqFXibZ3wSSGF5qv42CfdBSxf7VOL7orBi6Q4V1lf2ESR77BMB5czboP0i00Bp58jqZ7');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const amount = req.body.amount;
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-11-20.acacia'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51QNuLJHloYzfCwKQQemhS8JbWqe8rbdqAM4HNEvZjBG9xcjW7NLHN0x3rZnFMn04cQDt3BrnSv0j49BqTLFm1OVI00Ldvi3pe6'
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});     