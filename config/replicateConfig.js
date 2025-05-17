const Replicate = require('replicate');

if (!process.env.STABILITY_API_KEY) {
  throw new Error('REPLICATE_API_KEY manquante dans .env');
}

const replicate = new Replicate({
  auth: process.env.STABILITY_API_KEY
});

module.exports = replicate;