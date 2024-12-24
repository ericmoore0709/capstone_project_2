const Shelf = require('../../src/models/shelf');
const db = require('../../db.js');
const { NotFoundError, ConflictError } = require('../../expressError');
const { setupTests, resetDatabase, teardownTests, populateTables } = require('../commonSetup.js');

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

describe('shelf model', () => {

    describe('create method', () => {
        it('creates successfully', async () => {
            // attempt to add shelf to database
            const shelfToCreate = { user_id: 1, label: 'Test' };
            const result = await Shelf.create(shelfToCreate);

            // expect shelf was added to the database
            expect(result).not.toBeNull();
            expect(result.id).toBeGreaterThan(0);
            expect(result.userId).toBeGreaterThan(0);
            expect(result.label).toBe(shelfToCreate.label);
        });

        it('throws error if duplicate', async () => {
            // attempt to add first shelf to the database
            const shelfToCreate = { user_id: 1, label: 'Test' };
            await Shelf.create(shelfToCreate);

            // assert that attempt to add duplicate shelf will throw error
            await expect(Shelf.create(shelfToCreate)).rejects.toThrow(ConflictError);
        });
    });

    describe('findById method', () => {
        it('finds the shelf', async () => {
            // add shelf to be found to the database
            const shelfToCreate = { user_id: 1, label: 'Test' };
            const createdShelf = await Shelf.create(shelfToCreate);

            // query database for added shelf
            const result = await Shelf.findById(createdShelf.id);

            // assert that shelf was found
            expect(result).not.toBeNull();
            expect(result.id).toBeGreaterThan(0);
            expect(result.userId).toBeGreaterThan(0);
            expect(result.label).toBe(shelfToCreate.label);
        });

        it('throws NotFound if shelf not exists', async () => {
            // set non-existent id to attempt to find by
            const fakeShelfId = 999;

            // assert that attempt to find throws NotFound
            await expect(Shelf.findById(fakeShelfId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('findByUserId method', () => {
        it('finds the shelves by user id', async () => {
            const userId = 1;

            // add shelves to the database
            const userShelves = [
                { user_id: userId, label: 'Test1' },
                { user_id: userId, label: 'Test2' },
                { user_id: userId, label: 'Test3' }
            ];
            await Shelf.create(userShelves[0]);
            await Shelf.create(userShelves[1]);
            await Shelf.create(userShelves[2]);

            // attempt to find shelves
            const result = await Shelf.findByUserId(userId);

            // assert that shelves exist
            expect(result.length).toBeGreaterThan(0);
            expect(result.map((shelf) => shelf.id)[0]).toBeGreaterThan(0);
            expect(result.map((shelf) => shelf.userId)).toContain(userShelves[2].user_id);
            expect(result.map((shelf) => shelf.label)).toContain(userShelves[2].label);
        });

        it('throws NotFound if user id not exists', async () => {
            const userId = 999;

            // assert that shelves find throws NotFound
            await expect(Shelf.findByUserId(userId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('findAll method', () => {
        it('finds all shelves', async () => {
            // add shelves to the database
            const userShelves = [
                { user_id: 1, label: 'Test1' },
                { user_id: 1, label: 'Test2' },
                { user_id: 1, label: 'Test3' }
            ];
            await Shelf.create(userShelves[0]);
            await Shelf.create(userShelves[1]);
            await Shelf.create(userShelves[2]);

            // attempt to find all shelves
            const result = await Shelf.findAll();

            // assert that all shelves were found
            expect(result.length).toBe(3);
            expect(result.map((shelf) => shelf.userId)).toContain(1);
            expect(result.map((shelf) => shelf.label)).toContain('Test3');
        });
    });

    describe('update method', () => {
        it('updates shelf', async () => {
            // add shelf to database
            const shelfToCreate = { user_id: 1, label: 'Test' };
            const createdShelf = await Shelf.create(shelfToCreate);

            // attempt to update shelf
            const shelfToUpdate = { id: createdShelf.id, userId: createdShelf.userId, label: 'NewTest' };
            const result = await Shelf.update(shelfToUpdate);

            // assert shelf has been updated
            expect(result).not.toBeNull();
            expect(result.id).toBe(createdShelf.id);
            expect(result.userId).toBe(createdShelf.userId);
            expect(result.label).toBe(shelfToUpdate.label);
        });

        it('throws NotFound if id not exists', async () => {
            // create fake shelf to attempt to update with
            const shelfId = 999;
            const fakeUpdateShelf = { shelfId, userId: 1, label: 'Fake' };

            // assert update attempt throws NotFound
            await expect(Shelf.update(fakeUpdateShelf)).rejects.toThrow(NotFoundError);
        });
    });

    describe('delete method', () => {
        it('deletes shelf', async () => {
            // add shelf to database
            const shelfToCreate = { user_id: 1, label: 'Test' };
            const createdShelf = await Shelf.create(shelfToCreate);

            // attempt to delete shelf
            const result = await Shelf.delete(createdShelf.id);

            // assert shelf has been deleted
            await expect(Shelf.findById(createdShelf.id)).rejects.toThrow(NotFoundError);

            // assert shelf cannot be further deleted
            await expect(Shelf.delete(createdShelf.id)).rejects.toThrow(NotFoundError);
        });

        it('throws NotFound if id not exists', async () => {
            const shelfId = 999;

            // assert that deletion attempt throws NotFound
            await expect(Shelf.delete(shelfId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('addRecipe', () => {
        it('successfully adds recipe to shelf', async () => {
            const userId = 1;
            const recipeId = 1;

            const shelf = await db.query('INSERT INTO shelves (user_id, label) VALUES ($1, $2) RETURNING id', [userId, 'Test']);
            const shelfId = shelf.rows[0].id;

            const result = await Shelf.addRecipe(shelfId, recipeId);

            expect(result.shelfId).toEqual(shelfId);
            expect(result.recipeId).toEqual(recipeId);
        });

        it('refuses to add duplicate recipe', async () => {
            const userId = 1;
            const recipeId = 1;

            const shelf = await db.query('INSERT INTO shelves (user_id, label) VALUES ($1, $2) RETURNING id', [userId, 'Test']);
            const shelfId = shelf.rows[0].id;

            await db.query('INSERT INTO shelf_recipes (shelf_id, recipe_id) VALUES ($1, $2)', [shelfId, recipeId]);

            await expect(Shelf.addRecipe(shelfId, recipeId)).rejects.toThrow(ConflictError);
        });
    });

    describe('removeRecipe', () => {
        it('successfully removes recipe from shelf', async () => {
            const userId = 1;
            const recipeId = 1;

            const shelf = await db.query('INSERT INTO shelves (user_id, label) VALUES ($1, $2) RETURNING id', [userId, 'Test']);
            const shelfId = shelf.rows[0].id;

            await db.query('INSERT INTO shelf_recipes (shelf_id, recipe_id) VALUES ($1, $2)', [shelfId, recipeId]);

            const result = await Shelf.removeRecipe(shelfId, recipeId);

            expect(result.shelfId).toEqual(shelfId);
            expect(result.recipeId).toEqual(recipeId);

        });

        it('cannot find recipe in shelf', async () => {
            const shelfId = 1;
            const recipeId = 1;

            await expect(Shelf.removeRecipe(shelfId, recipeId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('getRecipes', () => {
        it('gets recipes from shelf', async () => {
            const shelfToCreate = { user_id: 1, label: 'Test' };
            const shelf = await Shelf.create(shelfToCreate);

            // add recipes to the shelf
            await Shelf.addRecipe(shelf.id, 1);

            // attempt to get recipes from the shelf
            const result = await Shelf.getRecipes(shelf.id);

            // assert that recipes were retrived
            expect(result.length).toBe(1);
            expect(result[0]).not.toBeNull();
            expect(result[0].title.length).toBeGreaterThan(0);
            expect(result[0].id).toBe(1);
        });
    });

});