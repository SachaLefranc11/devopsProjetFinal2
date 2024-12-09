const db = require('../models/db_conf');

module.exports.validateData = (data) => {
  if (!data.name || data.size_km <= 0) return false; // Ajout de la validation du nom
  return true;
};


