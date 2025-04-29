const Stripe = require('stripe')

require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  try {
      const { line_items } = req.body;
      
      // Log the request body to see what is being sent
      console.log("Received line_items:", line_items);
      
      if (!line_items || line_items.length === 0) {
          throw new Error("No line_items provided");
      }

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: line_items,
          mode: 'payment',
          success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: 'http://localhost:5173/',
      });

      // Log the session id to ensure it's created
      console.log("Stripe session created with ID:", session.id);

      res.json({ id: session.id });
  } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send({ error: error.message }); // Send error message in response
  }

    
    
};




const checkoutSuccess = async (req, res) => {
    return res.status(200).json({
        message: 'success'
    })
   
};
const checkoutCancel = async (req, res) => {
  return res.status(204).json({
    message: 'cancel'
})
   
};

module.exports = { checkout , checkoutSuccess, checkoutCancel };
