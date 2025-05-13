const axios = require('axios');
const FormData = require('form-data');

// Traduction améliorée avec fallback
async function translateToEnglish(text) {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: 'fr|en',
        max: 1 // Limite à 1 résultat
      },
      timeout: 5000 // Timeout après 5s
    });

    return response.data?.responseData?.translatedText?.trim() || text;
  } catch (error) {
    console.error('Erreur traduction:', error.message);
    return text;
  }
}

exports.generateImage = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!process.env.STABILITY_API_KEY) {
      throw new Error('Clé API Stability non configurée');
    }

    // Traduction des éléments avec vérification
    const translatedItems = await Promise.all(
      items.map(item => translateToEnglish(item))
    );
    
    const ingredientsList = translatedItems.filter(Boolean).join(', ');
    if (!ingredientsList) {
      return res.status(400).json({ error: 'Liste d\'ingrédients invalide' });
    }

    // Construction du prompt optimisé
    const basePrompt = `Professional food photography of ${ingredientsList} on a plate`;
    const translatedPrompt = await translateToEnglish(basePrompt);

    const formData = new FormData();
    formData.append('prompt', translatedPrompt);
    formData.append('negative_prompt', 'text, drawing, cartoon, artificial, plastic');
    formData.append('output_format', 'jpeg');
    formData.append('cfg_scale', '7'); // Contrôle de la créativité
    formData.append('samples', '1');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          ...formData.getHeaders(),
          Accept: 'image/*'
        },
        responseType: 'arraybuffer',
        timeout: 30000 // Timeout après 30s
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error('Réponse vide de l\'API Stability');
    }

    const base64Image = Buffer.from(response.data).toString('base64');
    res.json({ 
      imageUrl: `data:image/jpeg;base64,${base64Image}`,
      promptUsed: translatedPrompt
    });

  } catch (error) {
    console.error('Erreur génération image:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data?.toString().substring(0, 100)
    });

    res.status(error.response?.status || 500).json({
      error: 'Échec de génération',
      details: error.response?.data?.toString() || error.message,
      suggestion: 'Vérifiez votre clé API et vos crédits Stability AI'
    });
  }
};