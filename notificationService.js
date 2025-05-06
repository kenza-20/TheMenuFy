// notificationService.js
const sendNotificationToChef = async (chefid, notification) => {
    // Ici, vous pouvez envoyer la notification via WebSockets, ou autre méthode
    // Exemple d'envoi via une logique personnalisée
    console.log(`Sending notification to chef ${chefid}:`);
    console.log(`Item: ${notification.itemName}`);
    console.log(`Quantity: ${notification.itemQuantity}`);
    console.log(`Restaurant ID: ${notification.restoid}`);
    
    // Simuler l'envoi de notification, peut-être un système d'email, ou autre service
  };
  
  module.exports = { sendNotificationToChef };