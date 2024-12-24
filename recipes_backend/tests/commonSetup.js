const db = require('../db');
const app = require('../app');
const supertest = require('supertest');

let request;

const setupTests = async () => {
    // Ensure a clean slate for the database
    await db.query(`
    TRUNCATE shelf_recipes, shelves, recipes, recipe_tags, tags, users, profiles RESTART IDENTITY CASCADE;
  `);

    // Initialize the request object for Supertest
    request = supertest(app);
};

const populateTables = async () => {
    // add initial data to database
    await db.query(`INSERT INTO users (first_name, last_name, email, google_id) VALUES ('Test', 'User', 'tuser@email.com', 1234567890)`);
    await db.query(`INSERT INTO tags (value) VALUES ('Test')`);
    await db.query(`INSERT INTO recipes (title, description, image, author_id, visibility_id) VALUES ('Title', 'Desc', null, 1, 1)`);
}

const resetDatabase = async () => {
    // Reset data for every test
    await db.query(`
    TRUNCATE shelf_recipes, shelves, recipes, recipe_tags, tags, users, profiles RESTART IDENTITY CASCADE;
  `);
};

const teardownTests = async () => {
    // Close database connection
    await db.end();
};

module.exports = {
    setupTests,
    populateTables,
    resetDatabase,
    teardownTests,
    request
};
