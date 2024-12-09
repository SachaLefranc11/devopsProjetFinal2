describe('Planet.validateData', () => {
  it('should return true for valid data', () => {
    const Planet = require('../models/Planet'); // Charger uniquement après chaque étape
    const result = Planet.validateData({ name: 'Earth', size_km: 12742 });
    expect(result).toBe(true);
  });
});
