const db = require('../models/db_conf');

module.exports.validateData = (data) => {
  if (!data.name || typeof data.size_km !== 'number' || data.size_km <= 0) return false; // Vérification du type
  return true;
};

module.exports.findByName = (name) => {
  return db.prepare("SELECT * FROM planets WHERE name = ?").get(name);
};



