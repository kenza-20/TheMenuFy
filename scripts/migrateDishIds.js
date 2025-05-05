require('dotenv').config();
const mongoose = require('mongoose');
const Dish = require('../models/dishModel');
const PlacedOrder = require('../models/PlacedOrder');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connecté à MongoDB pour migration");

    const orders = await PlacedOrder.find();

    for (const order of orders) {
      let updated = false;
      for (const item of order.items) {
        if (!item.dishId && item.name) {
          const dish = await Dish.findOne({ name: item.name });
          if (dish) {
            item.dishId = dish._id;
            updated = true;
            console.log(`🧩 Ajout de dishId à "${item.name}" : ${dish._id}`);
          } else {
            console.warn(`⚠️ Aucun plat trouvé pour "${item.name}"`);
          }
        }
      }

      if (updated) {
        await order.save();
        console.log(`✅ Commande ${order._id} mise à jour.`);
      }
    }

    mongoose.disconnect();
    console.log("🔚 Migration terminée.");
  })
  .catch(err => {
    console.error("❌ Erreur de migration :", err);
  });
