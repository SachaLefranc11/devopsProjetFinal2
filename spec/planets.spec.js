describe('Planet.validateData', () => {

  it('should return true for valid data', () => {

    const Planet = require('../models/Planet'); // Charger uniquement après chaque étape

    const result = Planet.validateData({ name: 'Earth', size_km: 12742 });

    expect(result).toBe(true);
  });

  it('should return false for negative size', () => {

    const Planet = require('../models/Planet');

    const result = Planet.validateData({ name: 'Earth', size_km: -1 });

    expect(result).toBe(false);
  });

  it('should return false for empty name', () => {

    const Planet = require('../models/Planet');

    const result = Planet.validateData({ name: '', size_km: 12742 });

    expect(result).toBe(false);
  });

  it('should return false if size_km is not a number', () => {

    const Planet = require('../models/Planet');

    const result = Planet.validateData({ name: 'Earth', size_km: 'large' });

    expect(result).toBe(false);
  });  
});

const Planet = require('../models/Planet');

describe('Planet.findByName', () => {
  it('should return the planet if it exists', () => {
    // Mock de la fonction db.prepare().get()
    const mockDb = {
      prepare: jasmine.createSpy('prepare').and.returnValue({
        get: jasmine.createSpy('get').and.callFake((name) => {
          return name === 'Mars' ? { name: 'Mars' } : null;
        }),
      }),
    };

    // Remplacer la configuration de la base de données par le mock
    spyOn(require('../models/db_conf'), 'prepare').and.callFake(mockDb.prepare);

    // Appeler la méthode et vérifier le résultat
    const result = Planet.findByName('Mars');
    expect(result).toEqual({ name: 'Mars' });

    // Vérifier que les espions ont été appelés avec les bons arguments
    expect(mockDb.prepare).toHaveBeenCalledWith("SELECT * FROM planets WHERE name = ?");
    expect(mockDb.prepare().get).toHaveBeenCalledWith('Mars');
  });
});


