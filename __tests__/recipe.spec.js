const RecipeController = require('../controlleurs/RecipeController');
const Recipe = require('../models/Recipe');

jest.mock('../models/Recipe');

describe('Recipe Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should be a placeholder test', () => {
    expect(true).toBe(true);
  });
});
