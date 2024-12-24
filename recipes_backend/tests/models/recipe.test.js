const Recipe = require('../../src/models/recipe');
const db = require('../../db.js');
const { NotFoundError } = require('../../expressError');
const { setupTests, resetDatabase, teardownTests, populateTables } = require('../commonSetup.js');

// Helper to reset test data
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

describe("Recipe model", () => {
    describe("create", () => {
        test("successfully creates a recipe", async () => {
            const newRecipe = {
                title: "Test Recipe",
                description: "A recipe for testing",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            };
            const recipe = await Recipe.create(newRecipe);

            expect(recipe).toEqual(expect.objectContaining(newRecipe));
            expect(recipe).toHaveProperty("id");
            expect(recipe).toHaveProperty("uploaded_at");
        });
    });

    describe("findRecipes", () => {
        test("retrieves recipes without filters", async () => {
            const recipes = await Recipe.findRecipes({});
            expect(Array.isArray(recipes)).toBe(true);
        });

        test("retrieves recipes by user ID", async () => {
            const userId = 1;
            const recipes = await Recipe.findRecipes({ userId });
            expect(recipes.every(r => r.author_id === userId)).toBe(true);
        });

        test("retrieves only public recipes", async () => {
            const recipes = await Recipe.findRecipes({ publicOnly: true });
            expect(recipes.every(r => r.visibility_id === 1)).toBe(true);
        });
    });

    describe("get", () => {
        test("successfully retrieves a recipe by ID", async () => {
            const recipe = await Recipe.create({
                title: "Fetch Test",
                description: "Testing fetch by ID",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            const fetched = await Recipe.get(recipe.id);

            expect(fetched).toEqual(expect.objectContaining(recipe));
        });

        test("throws NotFoundError if recipe not found", async () => {
            await expect(Recipe.get(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("update", () => {
        test("successfully updates a recipe", async () => {
            const recipe = await Recipe.create({
                title: "Update Test",
                description: "Testing update",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            const updatedData = { title: "Updated Title" };
            const updatedRecipe = await Recipe.update(recipe.id, updatedData);

            expect(updatedRecipe.title).toBe("Updated Title");
            expect(updatedRecipe).toHaveProperty("last_updated_at");
        });

        test("throws NotFoundError if recipe not found", async () => {
            await expect(Recipe.update(0, { title: "No Recipe" })).rejects.toThrow(NotFoundError);
        });
    });

    describe("remove", () => {
        test("soft deletes a recipe", async () => {
            const recipe = await Recipe.create({
                title: "Delete Test",
                description: "Testing deletion",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            await Recipe.remove(recipe.id);

            await expect(Recipe.get(recipe.id)).rejects.toThrow(NotFoundError);
        });
    });

    describe("tags", () => {
        test("retrieves tags for a recipe", async () => {
            const recipe = await Recipe.create({
                title: "Tag Test",
                description: "Testing tags",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            // Add a tag to this recipe for testing
            await Recipe.addTag(recipe.id, 1);
            const tags = await Recipe.getTags(recipe.id);

            expect(tags).toEqual(expect.arrayContaining([{ id: 1, value: expect.any(String) }]));
        });

        test("adds a tag to a recipe", async () => {
            const recipe = await Recipe.create({
                title: "Add Tag Test",
                description: "Testing adding tags",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            const tag = await Recipe.addTag(recipe.id, 1);

            expect(tag).toEqual({ recipe_id: recipe.id, tag_id: 1 });
        });

        test("removes a tag from a recipe", async () => {
            const recipe = await Recipe.create({
                title: "Remove Tag Test",
                description: "Testing removing tags",
                image: "http://example.com/image.jpg",
                author_id: 1,
                visibility_id: 1
            });
            await Recipe.addTag(recipe.id, 1);
            await Recipe.removeTag(recipe.id, 1);

            const tags = await Recipe.getTags(recipe.id);
            expect(tags).not.toEqual(expect.arrayContaining([{ id: 1 }]));
        });
    });
});
