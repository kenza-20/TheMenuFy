const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', userSchema, 'users');

(async () => {
  try {
    await mongoose.connect(uri);

    const users = await User.find({});
    for (const user of users) {
      let modified = false;
      const fixedFriends = user.friends.map(friend => {
        if (typeof friend === 'string') {
          modified = true;
          return new mongoose.Types.ObjectId(friend);
        }
        return friend;
      });

      if (modified) {
        user.friends = fixedFriends;
        await user.save();
        console.log(`✅ Utilisateur corrigé : ${user._id}`);
      }
    }

    console.log("✅ Tous les amis de type string ont été convertis en ObjectId.");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
})();
