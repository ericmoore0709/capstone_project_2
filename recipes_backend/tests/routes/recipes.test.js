const request = require('supertest');
const express = require('express');
const Recipe = require('../../src/models/recipe');
const app = require('../../app');
const jsonschema = require('jsonschema');

describe('GET /recipes', () => {
    it('should return a list of public recipes', async () => {
        const mockRecipes = [{ id: 1, name: 'Recipe1' }, { id: 2, name: 'Recipe2' }];
        jest.spyOn(Recipe, 'findRecipes').mockResolvedValue(mockRecipes);

        const res = await request(app).get('/recipes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ recipes: mockRecipes });
    });
});

describe('GET /recipes/:id', () => {
    it('should return a recipe and associated tags by ID', async () => {
        const mockRecipe = { id: 1, name: 'Recipe1' };
        const mockTags = [{ id: 1, name: 'Tag1' }];
        jest.spyOn(Recipe, 'get').mockResolvedValue(mockRecipe);
        jest.spyOn(Recipe, 'getTags').mockResolvedValue(mockTags);

        const res = await request(app).get('/recipes/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ recipe: mockRecipe, tags: mockTags });
    });

    it('should return 404 if recipe not found', async () => {
        jest.spyOn(Recipe, 'get').mockResolvedValue(null);

        const res = await request(app).get('/recipes/999');
        expect(res.statusCode).toBe(404);
    });
});

describe('POST /recipes', () => {
    it('should create a new recipe', async () => {
        const mockRecipe = { id: 1, name: 'New Recipe' };
        const mockBody = { name: 'New Recipe', public: true };

        jest.spyOn(jsonschema, 'validate').mockReturnValue({ valid: true });
        jest.spyOn(Recipe, 'create').mockResolvedValue(mockRecipe);

        const res = await request(app).post('/recipes').send(mockBody);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ recipe: mockRecipe });
    });

    it('should return 400 for invalid data', async () => {
        jest.spyOn(jsonschema, 'validate').mockReturnValue({
            valid: false,
            errors: [{ stack: 'Error in data' }],
        });

        const res = await request(app).post('/recipes').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toEqual(['Error in data']);
    });
});
