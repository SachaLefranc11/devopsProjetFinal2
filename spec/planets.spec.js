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
  
});
