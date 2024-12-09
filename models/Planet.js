const db = require('../models/db_conf');

module.exports.validateData = (data) => {
  if (data.size_km <= 0) return false; // Vérifie la taille minimale
  return true;
};

