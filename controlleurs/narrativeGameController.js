const fs = require('fs');
const path = require('path');

const scenarioPath = path.join(__dirname, '../data/narrativeFlow.json');
const narrativeData = JSON.parse(fs.readFileSync(scenarioPath));
const Recipe = require('../models/Recipe'); // adapte le chemin si besoin

const getStep = (req, res) => {
  const { stepId } = req.params;
  const step = narrativeData[stepId || 'start'];

  if (!step) {
    return res.status(404).json({ error: 'Étape introuvable' });
  }

  res.json(step);
};

const generateFinalPlate = async (req, res) => {
  const generatedPlates = [
    {
      name: "Soupe céleste à la cannelle et truffe",
      description: "Un mélange doux-amer inspiré des cuisines flottantes et des arômes mystérieux...",
      image: "/images/generated/soupe-cannelle.jpg"
    },
    {
      name: "Tarte tropicale mangue-moutarde",
      description: "Une fusion inattendue et explosive entre acidité fruitée et chaleur épicée.",
      image: "/images/generated/tarte-mangue.jpg"
    },
    {
      name: "Curry mystique des profondeurs boisées",
      description: "Un plat chaud aux champignons sauvages qui éveille la forêt en toi...",
      image: "/images/generated/curry-champignon.jpg"
    },
    {
      name: "Crème brûlée de paprika flottant",
      description: "Une touche sucrée et piquante sortie d’un monde suspendu.",
      image: "/images/generated/creme-paprika.jpg"
    }
  ];

  const plate = generatedPlates[Math.floor(Math.random() * generatedPlates.length)];

  // 🔍 Recherche d’un plat réel (similaire) dans la base
let match = await Recipe.findOne({
  name: { $regex: plate.name.split(' ')[0], $options: 'i' }
});

if (!match) {
  // 🔁 S’il n’y a pas de match, prends un plat au hasard depuis la base
  const random = await Recipe.aggregate([{ $sample: { size: 1 } }]);
  match = random[0];
}


  res.json({
    plate,
    similarInMenu: match ? {
      id: match._id,
      name: match.name,
      image: match.image,
      description: match.description
    } : null
  });
};

module.exports = {
  getStep,
  generateFinalPlate
};
