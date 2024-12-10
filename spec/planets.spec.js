const Planet = require('../models/Planet');
const dbConf = require('../models/db_conf');
const express = require('express');
const router = require('../routes/planets');

describe('Planet.validateData', () => {
  it('should return true for valid data', () => {
    const result = Planet.validateData({ name: 'Earth', size_km: 12742 });
    expect(result).toBe(true);
  });

  it('should return false for negative size', () => {
    const result = Planet.validateData({ name: 'Earth', size_km: -1 });
    expect(result).toBe(false);
  });

  it('should return false for empty name', () => {
    const result = Planet.validateData({ name: '', size_km: 12742 });
    expect(result).toBe(false);
  });

  it('should return false if size_km is not a number', () => {
    const result = Planet.validateData({ name: 'Earth', size_km: 'large' });
    expect(result).toBe(false);
  });
});

describe('Planet.findByName', () => {
  it('should return the planet if it exists', () => {
    const mockDb = {
      prepare: jasmine.createSpy('prepare').and.returnValue({
        get: jasmine.createSpy('get').and.callFake((name) => 
          name === 'Mars' ? { name: 'Mars' } : null
        ),
      }),
    };

    spyOn(dbConf, 'prepare').and.callFake(mockDb.prepare);

    const result = Planet.findByName('Mars');
    expect(result).toEqual({ name: 'Mars' });

    expect(mockDb.prepare).toHaveBeenCalledWith("SELECT * FROM planets WHERE name = ?");
    expect(mockDb.prepare().get).toHaveBeenCalledWith('Mars');
  });

  it('should return null if the planet does not exist', () => {
    const mockDb = {
      prepare: jasmine.createSpy('prepare').and.returnValue({
        get: jasmine.createSpy('get').and.returnValue(null),
      }),
    };

    spyOn(dbConf, 'prepare').and.callFake(mockDb.prepare);

    const result = Planet.findByName('Pluto');
    expect(result).toBeNull();

    expect(mockDb.prepare).toHaveBeenCalledWith("SELECT * FROM planets WHERE name = ?");
    expect(mockDb.prepare().get).toHaveBeenCalledWith('Pluto');
  });
});
describe('Planet.add', () => {
  it('should add a planet if it does not exist', () => {
    // Mock de la fonction db.prepare().get() et db.prepare().run()
    const mockDb = {
      prepare: jasmine.createSpy('prepare').and.returnValue({
        get: jasmine.createSpy('get').and.callFake(() => null), // Simule une planète inexistante
        run: jasmine.createSpy('run').and.callFake(() => true), // Simule l'insertion réussie
      }),
    };

    // Remplacer la configuration de la base de données par le mock
    spyOn(require('../models/db_conf'), 'prepare').and.callFake(mockDb.prepare);

    // Appeler la méthode et vérifier le résultat
    const result = Planet.add({ name: 'Pluto', size_km: 2376 });
    expect(result).toBe(true);

    // Vérifier que les espions ont été appelés avec les bons arguments
    expect(mockDb.prepare).toHaveBeenCalledWith(
      "SELECT * FROM planets WHERE name = ?"
    );
    expect(mockDb.prepare().get).toHaveBeenCalledWith('Pluto');
    expect(mockDb.prepare().run).toHaveBeenCalledWith(
      'Pluto', 2376, undefined, undefined, undefined, null
    ); // Vérification des arguments utilisés dans la requête d'insertion
  });
  it('should return false if the planet already exists', () => {
    // Mock de la fonction db.prepare().get()
    const mockDb = {
      prepare: jasmine.createSpy('prepare').and.returnValue({
        get: jasmine.createSpy('get').and.callFake(() => ({ name: 'Mars' })), // Simule une planète existante
      }),
    };

    // Remplacer la configuration de la base de données par le mock
    spyOn(require('../models/db_conf'), 'prepare').and.callFake(mockDb.prepare);

    // Appeler la méthode et vérifier le résultat
    const result = Planet.add({ name: 'Mars', size_km: 6794 });
    expect(result).toBe(false);

    // Vérifier que les espions ont été appelés avec les bons arguments
    expect(mockDb.prepare).toHaveBeenCalledWith(
      "SELECT * FROM planets WHERE name = ?"
    );
    expect(mockDb.prepare().get).toHaveBeenCalledWith('Mars');
    // Aucun appel à run attendu puisque la planète existe déjà
  });

});


describe('POST /planets/add', () => {
  let req, res;

  beforeEach(() => {
    // Simuler les objets req et res
    req = {
      body: { name: 'Venus', size_km: 12104 }, // Les données envoyées dans la requête
    };

    res = {
      status: jasmine.createSpy('status').and.returnValue({
        send: jasmine.createSpy('send'),
      }),
    };

    // Créer un espion sur la méthode `add` de Planet
    spyOn(Planet, 'add');
  });

  it('should call add and respond with success', () => {
    // Configurer l'espion pour qu'il retourne `true`
    Planet.add.and.returnValue(true);

    // Appeler directement la fonction de route
    router.handle({ method: 'POST', url: '/planets/add', ...req }, res, () => {});

    // Vérifier que Planet.add a été appelé avec les bonnes données
    expect(Planet.add).toHaveBeenCalledWith({ name: 'Venus', size_km: 12104 });

    // Vérifier la réponse HTTP
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status().send).toHaveBeenCalledWith('Planet added');
  });

  it('should respond with conflict if the planet already exists', () => {
    // Configurer l'espion pour qu'il retourne `false`
    Planet.add.and.returnValue(false);

    // Appeler directement la fonction de route
    router.handle({ method: 'POST', url: '/planets/add', ...req }, res, () => {});

    // Vérifier que Planet.add a été appelé avec les bonnes données
    expect(Planet.add).toHaveBeenCalledWith({ name: 'Venus', size_km: 12104 });

    // Vérifier la réponse HTTP
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status().send).toHaveBeenCalledWith('Planet already exists');
  });
});