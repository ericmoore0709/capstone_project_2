const request = require('supertest');
const express = require('express');
const Recipe = require('../../src/models/recipe');
const User = require('../../src/models/user');
const jsonschema = require('jsonschema');
const app = require('../../app'); // Assuming your app entry point is here
const { createToken } = require('../../src/helpers/tokens');
const { ForbiddenError, NotFoundError } = require('../../expressError');
const db = require('../../db');
const { teardownTests } = require('../commonSetup');

let VALID_TOKEN;

beforeAll(() => {
    const user = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@gmail.com',
        googleId: '1234567890',
        image: 'https://example-image.com/example/1'
    }

    VALID_TOKEN = createToken(user);
});

beforeEach(async () => {
    await db.query("BEGIN");
});

afterEach(async () => {
    await db.query("ROLLBACK");

    // restore the spy created with spyOn
    jest.restoreAllMocks();
});

afterAll(async () => {
    await teardownTests();
});

describe('GET /recipes', () => {
    it('should return a list of public recipes', async () => {
        const mockRecipes = [{ id: 1, title: 'Recipe1', author_id: 1 }, { id: 2, title: 'Recipe2', author_id: 2 }];
        const mockAuthors = [{ id: 1, username: 'Author1' }, { id: 2, username: 'Author2' }];

        jest.spyOn(Recipe, 'findRecipes').mockResolvedValue(mockRecipes);
        jest.spyOn(User, 'getById').mockImplementation(id => mockAuthors.find(author => author.id === id));

        const res = await request(app)
            .get('/recipes')
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            recipes: mockRecipes.map((recipe, idx) => ({ ...recipe, author: mockAuthors[idx] })),
        });
    });
});

describe('GET /recipes/user/:user_id', () => {
    it('should return a list of user’s recipes', async () => {
        const mockRecipes = [{ id: 1, title: 'Recipe1', author_id: 1 }];
        jest.spyOn(Recipe, 'findRecipes').mockResolvedValue(mockRecipes);
        jest.spyOn(User, 'getById').mockResolvedValue({ id: 1, username: 'testuser' });

        const res = await request(app)
            .get('/recipes/user/1')
            .set('Authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            recipes: mockRecipes.map(recipe => ({ ...recipe, author: { id: 1, username: 'testuser' } })),
        });
    });

    it('should return 403 if accessing another user’s recipes', async () => {
        const res = await request(app)
            .get('/recipes/user/2')
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(403);
    });
});

describe('POST /recipes', () => {
    it('should create a new recipe with valid data', async () => {
        const mockRecipe = { id: 1, title: 'New Recipe', author_id: 1 };
        const mockBody = { title: 'New Recipe', public: true };

        jest.spyOn(jsonschema, 'validate').mockReturnValue({ valid: true });
        jest.spyOn(Recipe, 'create').mockResolvedValue(mockRecipe);
        jest.spyOn(User, 'getById').mockResolvedValue({ id: 1, username: 'testuser' });

        const res = await request(app)
            .post('/recipes')
            .send(mockBody)
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            recipe: { ...mockRecipe, author: { id: 1, username: 'testuser' } },
        });
    });

    it('should return 400 for invalid data', async () => {
        jest.spyOn(jsonschema, 'validate').mockReturnValue({
            valid: false,
            errors: [{ stack: 'Error in data' }],
        });

        const res = await request(app)
            .post('/recipes')
            .send({})
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toEqual(['Error in data']);
    });
});

describe('PATCH /recipes/:id', () => {
    it('should update a recipe if user is the author', async () => {
        const mockRecipe = { id: 1, title: 'Updated Recipe', author_id: 1 };
        const mockBody = { title: 'Updated Recipe' };

        jest.spyOn(jsonschema, 'validate').mockReturnValue({ valid: true });
        jest.spyOn(Recipe, 'get').mockResolvedValue({ id: 1, title: 'Old Recipe', author_id: 1 });
        jest.spyOn(Recipe, 'update').mockResolvedValue(mockRecipe);
        jest.spyOn(User, 'getById').mockResolvedValue({ id: 1, username: 'testuser' });

        const res = await request(app)
            .patch('/recipes/1')
            .send(mockBody)
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            recipe: { ...mockRecipe, author: { id: 1, username: 'testuser' } },
        });
    });

    it('should return 403 if user is not the author', async () => {
        jest.spyOn(Recipe, 'get').mockResolvedValue({ id: 1, title: 'Old Recipe', description: 'Old Desc', visibility_id: 1, author_id: 2 });

        const res = await request(app)
            .patch('/recipes/1')
            .send({ title: 'Updated Recipe', description: 'Old Desc', visibility_id: 1 })
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        
        expect(res.statusCode).toBe(403);
    });
});

describe('DELETE /recipes/:id', () => {
    it('should soft delete a recipe if user is the author', async () => {
        jest.spyOn(Recipe, 'get').mockResolvedValue({ id: 1, title: 'Recipe to Delete', author_id: 1 });
        jest.spyOn(Recipe, 'remove').mockResolvedValue({ id: 1, title: 'Recipe to Delete', author_id: 1 });
        jest.spyOn(User, 'getById').mockResolvedValue({ id: 1, username: 'testuser' });

        const res = await request(app)
            .delete('/recipes/1')
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ recipe: { id: 1, title: 'Recipe to Delete', author_id: 1, author: { id: 1, username: 'testuser' } } });
    });

    it('should return 403 if user is not the author', async () => {
        jest.spyOn(Recipe, 'get').mockResolvedValue({ id: 1, title: 'Recipe to Delete', author_id: 2 });

        const res = await request(app)
            .delete('/recipes/1')
            .set('authorization', `Bearer ${VALID_TOKEN}`);
        expect(res.statusCode).toBe(403);
    });
});
