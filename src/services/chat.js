export const sendMessageToMenuBot = async (message) => {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
  
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error("Erreur frontend :", err);
      return "MenuBot n'a pas pu répondre. 😢";
    }
  };
  