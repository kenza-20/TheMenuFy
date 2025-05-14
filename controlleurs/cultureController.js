const fs = require('fs');
const path = require('path');

const culturePath = path.join(__dirname, '../data/cultureData.json');
const cultureData = JSON.parse(fs.readFileSync(culturePath));

const getCultureByCountry = (req, res) => {
  const { country } = req.params;
  const entry = cultureData[country];

  if (!entry) {
    return res.status(404).json({ error: 'Aucune donnée culturelle trouvée pour ce pays.' });
  }

  res.json(entry);
};

module.exports = {
  getCultureByCountry
};
