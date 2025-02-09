const express = require('express');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jsonschema = require('jsonschema');
const newRecipeSchema = require('../schemas/recipeNew.json');
const updateRecipeSchema = require('../schemas/recipeUpdate.json');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../../expressError');
const { ensureLoggedIn } = require('../middleware/auth');

const router = express.Router();


// GET /recipes => [{ recipe }, ...]
// Retrieves all public recipes
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const recipes = await Recipe.findRecipes({ publicOnly: true });

        const authoredRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const author = await User.getById(recipe.author_id);
                recipe.author = author;
                return { ...recipe, author };
            })
        );

        return res.json({ recipes: authoredRecipes });
    } catch (err) {
        return next(err);
    }
});

// GET /recipes/user/:user_id => [{ recipe }, ...]
// Retrieves all recipes by a specific user
router.get('/user/:user_id', ensureLoggedIn, async (req, res, next) => {
    const userId = +req.params.user_id;
    try {
        if (userId !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        const recipes = await Recipe.findRecipes({ userId });

        const authoredRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const author = await User.getById(recipe.author_id);
                recipe.author = author;
                return { ...recipe, author };
            })
        );

        return res.json({ recipes: authoredRecipes });
    } catch (err) {
        return next(err);
    }
});

// GET /recipes/user/:user_id/public => [{ recipe }, ...] 
// Retrieves all public recipes by a specific user
router.get('/user/:user_id/public', ensureLoggedIn, async (req, res, next) => {
    const userId = +req.params.user_id;
    try {
        const recipes = await Recipe.findRecipes({ userId, publicOnly: true });

        const authoredRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                const author = await User.getById(recipe.author_id);
                recipe.author = author;
                return { ...recipe, author };
            })
        );

        return res.json({ recipes: authoredRecipes });
    } catch (err) {
        return next(err);
    }
});

// GET /:id => { recipe }
// Retrieve a specific recipe by ID, including tags if they exist
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    const id = +req.params.id;

    try {
        const recipe = await Recipe.get(id);
        if (!recipe) throw new NotFoundError(`Recipe not found: ${id}`);

        const tags = await Recipe.getTags(id);
        recipe.tags = tags;

        const author = await User.getById(recipe.author_id);
        recipe.author = author;
        return res.status(200).json({ recipe });
    } catch (err) {
        return next(err);
    }
});

// POST / => { recipe }
// Create a new recipe
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, newRecipeSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const recipe = await Recipe.create(req.body);

        const author = await User.getById(recipe.author_id);
        recipe.author = author;

        return res.status(201).json({ recipe });
    } catch (err) {
        return next(err);
    }
});

// PATCH /:id => { recipe }
// Update a recipe by ID
router.patch('/:id', ensureLoggedIn, async (req, res, next) => {
    const id = +req.params.id;

    try {
        const validator = jsonschema.validate(req.body, updateRecipeSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const originalRecipe = await Recipe.get(id);
        if (originalRecipe.author_id !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        const recipe = await Recipe.update(id, req.body);

        const author = await User.getById(recipe.author_id);
        recipe.author = author;

        return res.status(200).json({ recipe });
    } catch (err) {
        return next(err);
    }
});

// DELETE /:id => { message: "Recipe deleted" }
// Soft delete a recipe by ID
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
    const id = +req.params.id;

    try {

        const originalRecipe = await Recipe.get(id);
        if (originalRecipe.author_id !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        // delete all associations with shelves
        await Recipe.removeFromShelves(id);

        const result = await Recipe.remove(id);  // Soft delete

        const author = await User.getById(result.author_id);
        result.author = author;

        return res.status(200).json({ recipe: result });
    } catch (err) {
        return next(err);
    }
});

// POST /:id/tags/:tag_id => { message: "Tag added" }
// Add a tag to a recipe
router.post('/:id/tags/:tag_id', ensureLoggedIn, async (req, res, next) => {
    const recipeId = +req.params.id;
    const tagId = +req.params.tag_id;

    try {
        const originalRecipe = await Recipe.get(recipeId);
        if (originalRecipe.author_id !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        await Recipe.addTag(recipeId, tagId);
        return res.status(201).json({ message: "Tag added" });
    } catch (err) {
        return next(err);
    }
});

// DELETE /:id/tags/:tag_id => { message: "Tag removed" }
// Remove a tag from a recipe
router.delete('/:id/tags/:tag_id', ensureLoggedIn, async (req, res, next) => {
    const recipeId = +req.params.id;
    const tagId = +req.params.tag_id;

    try {
        const originalRecipe = await Recipe.get(recipeId);
        if (originalRecipe.author_id !== res.locals.user.id)
            throw new ForbiddenError('You do not have permission to access this resource.');

        await Recipe.removeTag(recipeId, tagId);
        return res.status(200).json({ message: "Tag removed" });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
