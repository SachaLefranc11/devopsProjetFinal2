const express = require('express');
const Planet = require('../models/Planet');
const router = express.Router();

router.post('/planets/add', (req, res) => {
  // Vérification des données
  if (!Planet.validateData(req.body)) {
    return res.status(400).send('Invalid data'); // Statut 400 pour des données invalides
  }

  const result = Planet.add(req.body); // Appel de la méthode add
  if (!result) {
    return res.status(409).send('Planet already exists'); // Statut 409 si la planète existe
  }

  res.status(201).send('Planet added'); // Statut 201 si ajout réussi
});

module.exports = router;
