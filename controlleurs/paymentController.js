const Stripe = require('stripe')

require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
    try {
        const { line_items } = req.body;
    
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: line_items,
          mode: 'payment',
          success_url: `http://localhost:5173/`,
          cancel_url: `http://localhost:5173/`,
        });
    
        res.json({ id: session.id }); // Return sessionId here
      } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
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
