require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//const axios = require('axios')//.default;
//import axios from 'axios';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.post('/api/payments', async (req,res) => {
  try{
   // const notification= await axios.post("https://notification-service.vercel.app/api/notification",{
     //   email,
      //  text: "Payment Successful"
      //})
    const email= req.body.email
    const text= req.body.text
    const price= req.body.amount
    const amount= price*100
    if (!req.body.email || !req.body.amount) {
        return res.status(400).json({
          success: false,
          message: 'Email and amount are required fields.',
        });
      }
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      currency: 'egp',
      source: 'tok_mastercard',
      description: 'Rabbit Mart',
    });
 
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");


    return res.status(200).json({
      success: true,
      message: 'Payment Successful',
      id: charge.id,
    });
  } catch(error) {
  console.log("Error ", error)
    return res.status(200).json({
      success: false,
      message: 'Payment Failed',
      errors:error.message
    })
  }
});


app.listen(3000);