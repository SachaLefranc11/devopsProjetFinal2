const express = require('express');
const Planet = require('../models/Planet');
const router = express.Router();

router.post('/planets/add', (req, res) => {
  const result = Planet.add(req.body); // Appel de la méthode add
  if (!result) {
    return res.status(409).send('Planet already exists'); // Statut 409 si la planète existe
  }
  res.status(201).send('Planet added'); // Statut 201 si ajout réussi
});

module.exports = router;
