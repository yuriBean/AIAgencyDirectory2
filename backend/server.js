const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch'); 
const dotenv = require("dotenv");
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); 

const corsOptions = {
  origin: [
    'https://aiagencydirectory.com',
    'https://admin.aiagencydirectory.com',
    'https://www.aiagencydirectory.com',
    'https://www.admin.aiagencydirectory.com',
    'http://localhost:3000',
  ], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const checkWebsiteExists = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error('Error checking website:', error);
    return false;
  }
};

app.post('/check-website', async (req, res) => {
  const { websiteUrl } = req.body;
  console.log('Website URL to be checked:', websiteUrl);

  if (!websiteUrl) {
    return res.status(400).json({ error: 'Website URL is required' });
  }

  try {
    const exists = await checkWebsiteExists(websiteUrl);
    if (!exists) {
      return res.status(404).json({ error: 'Website does not exist' });
    }

    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: 'Error checking website' });
  }
});

const plans = [
  {
    plan_id: "price_1QK2ZsKPKkaHyzCs8pnDWVKa",
    plan_name: "Premium",
    duration: 'one-time'
  }
];

app.post('/create-subscription', async (req, res) => {
  const { plan_name, duration } = req.body;
  const plan = plans.find(p => p.plan_name === plan_name && p.duration === duration);

  if (!plan) {
    return res.status(400).json({ message: 'Plan not found' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ["card"],
      line_items: [{ price: plan.plan_id, quantity: 1 }],
      success_url: `https://aiagencydirectory.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://aiagencydirectory.com/fail`,
      customer_email: 'elizabetheden1415@gmail.com'
    });

    return res.status(200).json({ session });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create subscription session' });
  }
});

app.post('/save-payment', async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === "paid") {
      return res.status(200).json({ session });
    } else {
      res.status(400).json({ error: 'Payment incomplete' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error saving payment' });
  }
});

app.post('/send-invite', async (req, res) => {
  const { email, password } = req.body;

  const msg = {
    to: email,
    from: 'elizabetheden1415@gmail.com',
    subject: 'You are Invited!',
    text: `You have been invited! Your password is: ${password}`,
    html: `<strong>You have been invited!</strong><br>Your password is: <strong>${password}</strong>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
