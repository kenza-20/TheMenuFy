// controllers/webhookController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const GroupOrder = require('../models/group-order');
const User = require('../models/userModel');

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // You need to get the raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract metadata
    const { groupOrderCode, userId, paymentType } = session.metadata;
    
    if (groupOrderCode) {
      try {
        // Find the group order
        const groupOrder = await GroupOrder.findOne({ code: groupOrderCode });
        
        if (!groupOrder) {
          console.error(`Group order not found: ${groupOrderCode}`);
          return res.status(404).json({ message: "Group order not found" });
        }
        
        // If this is a single payment or all participants have paid, mark as completed
        if (paymentType === 'single') {
          groupOrder.status = 'completed';
          await groupOrder.save();
          
          // Update user order counts for loyalty program
          for (const participant of groupOrder.participants) {
            const user = await User.findById(participant.userId);
            if (user) {
                
                // Update loyalty level based on order count
                if (user.orderCount+1 >= 20) {
                    user.loyaltyLevel = 'Gold';
                } else if (user.orderCount+1 >= 10) {
                    user.loyaltyLevel = 'Silver';
                } else {
                    user.loyaltyLevel = 'Bronze'; // Default level
                }
                
                user.orderCount += 1;
              await user.save();
            }
          }
        } else {
          // For split or individual payments, we need to track who has paid
          // This would require additional fields in the GroupOrder model
          // For now, we'll just mark the order as completed
          groupOrder.status = 'completed';
          await groupOrder.save();
          
          // Update order count for the user who paid
          const user = await User.findById(userId);
          if (user) {
            user.orderCount += 1;
            
            // Update loyalty level based on order count
            if (user.orderCount >= 20) {
              user.loyaltyLevel = 'Gold';
            } else if (user.orderCount >= 10) {
              user.loyaltyLevel = 'Silver';
            }
            
            await user.save();
          }
        }
      } catch (error) {
        console.error("Error processing webhook:", error);
        return res.status(500).json({ message: "Error processing webhook", error: error.message });
      }
    }
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};