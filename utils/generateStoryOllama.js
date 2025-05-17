const axios = require("axios");

const generateStoryOllama = async (items) => {
  const prompt = `
Donne un résumé court (2-3 phrases) de cette commande :
${items.map((item) => `- ${item.quantity} x ${item.name}`).join("\n")}
`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false
  });

  return res.data.response.trim();
};

module.exports = { generateStoryOllama };
