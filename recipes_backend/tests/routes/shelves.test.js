const request = require('supertest');
const express = require('express');
const Shelf = require('../../src/models/shelf');
const app = require('../../app');
const jsonschema = require('jsonschema');
const { NotFoundError, ConflictError, InternalServerError } = require('../../expressError');
const { createToken } = require('../../src/helpers/tokens');
const db = require('../../db');

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
    await db.end();
});

describe('shelves routes', () => {
    describe('POST /', () => {

        it('successfully adds shelf', async () => {
            // set request body
            const reqBody = { user_id: 1, label: 'Test' }
            const expectedData = { id: 1, userId: 1, label: 'Test' };

            // mock model method return
            jest.spyOn(Shelf, 'create').mockResolvedValue(expectedData);

            // attempt request
            const response = await request(app).post('/shelves/').send(reqBody).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(201);
            expect(response.body.shelf).toEqual(expectedData);
        });

        it('fails to add duplicate shelf', async () => {
            // mock model method throw
            jest.spyOn(Shelf, 'create').mockRejectedValue(new ConflictError());

            // set request body
            const reqBody = { user_id: 1, label: 'Test' };

            // attempt request
            const response = await request(app).post('/shelves/').send(reqBody).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(409);
            expect(response.body.error).toContain('Conflict');
        });

        it('refuses due to invalid data', async () => {
            // set request body
            const reqBody = { label: 'Test' };

            // attempt request
            const response = await request(app).post('/shelves/').send(reqBody).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(400);
            expect(response.body.error).not.toBeNull();
        });

        it('refuses due to not logged in', async () => {
            // set request body
            const reqBody = { user_id: 1, label: 'Test' };

            // attempt request
            const response = await request(app).post('/shelves/').send(reqBody);

            // assert response data
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            // mock model method throw
            jest.spyOn(Shelf, 'create').mockRejectedValue(new InternalServerError());

            // set request body
            const reqBody = { user_id: 1, label: 'Test' };

            // attempt request
            const response = await request(app).post('/shelves/').send(reqBody).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    });

    describe('GET /', () => {
        it('successfully retrieves shelves', async () => {
            const shelves = [
                { id: 1, userId: 1, label: 'Test1' },
                { id: 2, userId: 1, label: 'Test2' },
                { id: 3, userId: 1, label: 'Test3' }
            ];

            // mock model method return
            jest.spyOn(Shelf, 'findAll').mockResolvedValue(shelves);

            // attempt request
            const response = await request(app).get('/shelves/').set('Authorization', `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(200);
            expect(response.body.shelves).not.toBeNull();
            expect(response.body.shelves.length).toBe(3);
            expect(response.body.shelves).toEqual(shelves);
        });

        it('refuses due to not logged in', async () => {
            // attempt request
            const response = await request(app).get('/shelves/');

            // assert response
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            // mock model method throw
            jest.spyOn(Shelf, 'findAll').mockRejectedValue(new InternalServerError());

            // attempt request
            const response = await request(app).get('/shelves/').set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        it('successfully retrieves shelf', async () => {
            const shelf = { id: 1, userId: 1, label: "Test" };

            // mock model method return
            jest.spyOn(Shelf, 'findById').mockResolvedValue(shelf);

            // attempt request
            const response = await request(app).get(`/shelves/${shelf.id}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(200);
            expect(response.body.shelf).toEqual(shelf);
        });

        it('fails to retrieve shelf not found', async () => {
            const shelfId = 999;

            // mock model method throw
            jest.spyOn(Shelf, 'findById').mockRejectedValue(new NotFoundError(`Shelf not found at id = ${shelfId}.`));

            // attempt request
            const response = await request(app).get(`/shelves/${shelfId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });

        it('refuses due to not logged in', async () => {
            const shelfId = 1;

            // attempt request
            const response = await request(app).get(`/shelves/${shelfId}`);

            // assert response data
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            const shelfId = 1;

            // mock model method throw
            jest.spyOn(Shelf, 'findById').mockRejectedValue(new InternalServerError());

            // attempt request
            const response = await request(app).get(`/shelves/${shelfId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    });

    describe('GET /users/:user_id', () => {
        it('successfully retrieves shelves', async () => {
            const userId = 1;
            const dateTime = new Date().toISOString()

            const recipes = [
                { id: 1, title: 'Recipe 1', description: 'Desc 1', visibility_id: 1, uploaded_at: dateTime, last_updated_at: dateTime },
                { id: 2, title: 'Recipe 2', description: 'Desc 2', visibility_id: 1, uploaded_at: dateTime, last_updated_at: dateTime },
                { id: 3, title: 'Recipe 3', description: 'Desc 3', visibility_id: 1, uploaded_at: dateTime, last_updated_at: dateTime }
            ];

            const shelves = [
                { id: 1, userId, label: 'Test1' },
                { id: 2, userId, label: 'Test2' },
                { id: 3, userId, label: 'Test3' }
            ];

            // mock model method return
            jest.spyOn(Shelf, 'findByUserId').mockResolvedValue(shelves);
            jest.spyOn(Shelf, 'getRecipes').mockResolvedValue(recipes);

            // attempt request
            const response = await request(app).get(`/shelves/users/${userId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(200);
            expect(response.body.shelves).toEqual(shelves);
        });

        it('fails to retrieve shelves if user not found', async () => {
            const userId = 999;

            // mock model method throw
            jest.spyOn(Shelf, 'findByUserId').mockRejectedValue(new NotFoundError(`Shelf not found at user ID = ${userId}`));

            // attempt request
            const response = await request(app).get(`/shelves/users/${userId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });

        it('refuses due to not logged in', async () => {
            const userId = 1;

            // attempt request
            const response = await request(app).get(`/shelves/users/${userId}`);

            // assert response data
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            const userId = 1;

            // mock model method return
            jest.spyOn(Shelf, 'findByUserId').mockRejectedValue(new InternalServerError());

            // attempt request
            const response = await request(app).get(`/shelves/users/${userId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    });

    describe('PATCH /:id', () => {
        it('successfully updates shelf', async () => {
            const expectedData = { id: 1, userId: 1, label: 'NewTest' };

            // set request body
            const reqBody = { label: expectedData.label };

            // mock model method return
            jest.spyOn(Shelf, 'update').mockResolvedValue(expectedData);
            jest.spyOn(Shelf, 'findById').mockResolvedValue({ ...expectedData, label: 'Test' });

            // attempt request
            const response = await request(app).patch(`/shelves/${1}`).send(reqBody).set("Authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(200);
            expect(response.body.shelf).toEqual(expectedData);
        });

        it('fails to udpate shelf if not found', async () => {
            const shelfId = 999;

            const shelfToUpdate = { label: 'TestFail' };

            // mock model method throw
            jest.spyOn(Shelf, 'update').mockRejectedValue(new NotFoundError(`Shelf not found at id = ${shelfId}.`));
            jest.spyOn(Shelf, 'findById').mockResolvedValue(new NotFoundError(`Shelf not found at id = ${shelfId}.`));

            // attempt request
            const response = await request(app).patch(`/shelves/${shelfId}`).send(shelfToUpdate).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });

        it('refuses due to not logged in', async () => {
            const shelfId = 1;
            const shelf = { label: 'NotLoggedIn' };

            // attempt request
            const response = await request(app).patch(`/shelves/${shelfId}`).send(shelf);

            // assert response data
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            const shelfId = 1;
            const shelf = { label: 'Failure' };

            // mock model method return
            jest.spyOn(Shelf, 'update').mockRejectedValue(new InternalServerError());
            jest.spyOn(Shelf, 'findById').mockRejectedValue(new InternalServerError());

            // attempt request
            const response = await request(app).patch(`/shelves/${shelfId}`).send(shelf).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    })

    describe('DELETE /:id', () => {
        it('successfully deletes shelf', async () => {
            const expectedData = { id: 1, userId: 1, label: 'Test' };

            // mock model method return
            jest.spyOn(Shelf, 'delete').mockResolvedValue(expectedData);
            jest.spyOn(Shelf, 'findById').mockResolvedValue(expectedData);

            // attempt request
            const response = await request(app).delete(`/shelves/${1}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ shelf: expectedData });
        });

        it('fails to delete shelf if not found', async () => {
            const shelfId = 999;

            // mock model method throw
            jest.spyOn(Shelf, 'delete').mockRejectedValue(new NotFoundError(`Shelf not found at id = ${shelfId}.`));
            jest.spyOn(Shelf, 'findById').mockRejectedValue(new NotFoundError(`Shelf not found at id = ${shelfId}.`));

            // attempt request
            const response = await request(app).delete(`/shelves/${shelfId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });

        it('refuses due to not logged in', async () => {
            const shelfId = 1;

            // attempt request
            const response = await request(app).delete(`/shelves/${shelfId}`);

            // assert response data
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toContain('logged in');
        });

        it('handles server failure', async () => {
            const shelfId = 1;

            // mock model method return
            jest.spyOn(Shelf, 'delete').mockRejectedValue(new InternalServerError());
            jest.spyOn(Shelf, 'findById').mockRejectedValue(new InternalServerError());

            // attempt request
            const response = await request(app).delete(`/shelves/${shelfId}`).set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response data
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Internal Server Error');
        });
    });

    describe('/:shelf_id/recipes/', () => {
        it('successfully adds recipe to shelf', async () => {
            const timeNow = new Date().toISOString();

            const shelfId = 1;
            const recipeId = 1;
            const reqBody = { id: 1, shelfId, recipeId };
            const expectedResult = {
                id: shelfId,
                label: 'Test Shelf',
                userId: 1,
                recipes: [
                    {
                        id: recipeId,
                        title: 'Test Recipe',
                        description: 'Test Desc',
                        userId: 1,
                        uploaded_at: timeNow,
                        last_updated_at: timeNow
                    }
                ]
            }

            // mock return value
            jest.spyOn(Shelf, 'addRecipe').mockResolvedValue(reqBody);
            jest.spyOn(Shelf, 'findById').mockResolvedValue(expectedResult);

            // attempt request
            const response = await request(app)
                .post(`/shelves/${shelfId}/recipes`)
                .send({ recipe_id: recipeId })
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(201);
            expect(response.body.shelf).toEqual(expectedResult);
        });

        it('fails to add duplicate recipe to shelf', async () => {
            const shelfId = 1;
            const recipeId = 1;

            // mock return value
            jest.spyOn(Shelf, 'addRecipe').mockRejectedValue(new ConflictError());

            // attempt request
            const response = await request(app)
                .post(`/shelves/${shelfId}/recipes`)
                .send({ recipe_id: recipeId })
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(409);
            expect(response.body.error).toContain('Conflict');
        });

        it('fails to add recipe to shelf not found', async () => {
            const shelfId = 999;
            const recipeId = 1;

            // mock return value
            jest.spyOn(Shelf, 'addRecipe').mockRejectedValue(new NotFoundError());

            // attempt request
            const response = await request(app)
                .post(`/shelves/${shelfId}/recipes`)
                .send({ recipe_id: recipeId })
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('Not Found');
        });

        it('fails to add recipe not found', async () => {
            const shelfId = 1;
            const recipeId = 999;

            // mock return value
            jest.spyOn(Shelf, 'addRecipe').mockRejectedValue(new NotFoundError());

            // attempt request
            const response = await request(app)
                .post(`/shelves/${shelfId}/recipes`)
                .send({ recipe_id: recipeId })
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('Not Found');
        });
    });

    describe('/:shelf_id/recipes/:recipe_id', () => {
        it('successfully removes recipe from shelf', async () => {
            const shelfId = 1;
            const recipeId = 1;
            const reqBody = { id: 1, shelfId, recipeId };
            const expectedResult = {
                id: shelfId,
                label: 'Test Shelf',
                userId: 1,
                recipes: []
            }

            // mock return value
            jest.spyOn(Shelf, 'removeRecipe').mockResolvedValue(reqBody);
            jest.spyOn(Shelf, 'findById').mockResolvedValue(expectedResult);

            // attempt request
            const response = await request(app)
                .delete(`/shelves/${shelfId}/recipes/${recipeId}`)
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(200);
            expect(response.body.shelf).toEqual(expectedResult);
        });

        it('fails to remove recipe not found', async () => {
            const shelfId = 1;
            const recipeId = 999;

            // mock return value
            jest.spyOn(Shelf, 'removeRecipe').mockRejectedValue(new NotFoundError());

            // attempt request
            const response = await request(app)
                .delete(`/shelves/${shelfId}/recipes/${recipeId}`)
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('Not Found');
        });

        it('fails to remove recipe from shelf not found', async () => {
            const shelfId = 999;
            const recipeId = 1;

            // mock return value
            jest.spyOn(Shelf, 'removeRecipe').mockRejectedValue(new NotFoundError());

            // attempt request
            const response = await request(app)
                .delete(`/shelves/${shelfId}/recipes/${recipeId}`)
                .set("authorization", `Bearer ${VALID_TOKEN}`);

            // assert response
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('Not Found');
        });
    });

});