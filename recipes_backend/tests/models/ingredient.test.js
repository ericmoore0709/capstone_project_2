const Ingredient = require('../../src/models/ingredient');
const db = require('../../db');
const { NotFoundError } = require('../../expressError');
const { setupTests, teardownTests, populateTables, resetDatabase } = require('../commonSetup');

beforeAll(async () => {
    await setupTests();
});

beforeEach(async () => {
    await populateTables();
});

afterEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await teardownTests();
});

describe('ingredient model', () => {
    describe('create', () => {
        it('should create successfully', async () => {
            const recipeId = 1;
            const content = '1 tsp of sugar.'
            const result = await Ingredient.create({recipeId, content});

            expect(result.id).toEqual(expect.any(Number));
            expect(result.content).toEqual(content);
            expect(result.recipe_id).toEqual(recipeId);
        });
    });

});