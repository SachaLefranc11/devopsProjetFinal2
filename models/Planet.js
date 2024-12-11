const db = require('../models/db_conf');

module.exports.list = () => {
  return db.prepare("SELECT * FROM planets").all();
};

module.exports.validateData = (data) => {
  if (!data.name || typeof data.size_km !== 'number' || data.size_km <= 0) return false; // Vérification du type
  return true;
};

module.exports.findByName = (name) => {
  return db.prepare("SELECT * FROM planets WHERE name = ?").get(name);
};
module.exports.add = (data) => {
  const existingPlanet = db.prepare("SELECT * FROM planets WHERE name = ?").get(data.name);
  if (existingPlanet) return false;

  db.prepare(`
    INSERT INTO planets (name, size_km, atmosphere, type, distance_from_sun_km, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.name, data.size_km, data.atmosphere, data.type, data.distance_from_sun_km, data.image || null);

  return true;
};



