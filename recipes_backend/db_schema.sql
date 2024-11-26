-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS profiles, shelf_recipes, shelves, recipe_tags, tags, recipe_visibility, recipes, users;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    google_id VARCHAR(100) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Recipe visibility table
CREATE TABLE recipe_visibility (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL UNIQUE
);

-- Recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    visibility_id INTEGER NOT NULL REFERENCES recipe_visibility(id),
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL UNIQUE
);

-- Recipe tags table (join table for many-to-many relationship)
CREATE TABLE recipe_tags (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id),
    tag_id INTEGER NOT NULL REFERENCES tags(id)
);

-- Shelves table
CREATE TABLE shelves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    label VARCHAR(50) NOT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,
    UNIQUE (user_id, label, deleted_at)  -- Ensures unique labels per user (unless deleted)
);

-- Shelf recipes table (join table for shelves and recipes)
CREATE TABLE shelf_recipes (
    id SERIAL PRIMARY KEY,
    shelf_id INTEGER NOT NULL REFERENCES shelves(id),
    recipe_id INTEGER NOT NULL REFERENCES recipes(id)
);

-- profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    bio VARCHAR(250) DEFAULT NULL
);

-- Trigger function to auto-update last_updated_at on update
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updating a row in recipes
CREATE TRIGGER set_last_updated
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();
