-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS profiles, communities, shelf_recipes, shelves, recipe_tags, tags, recipe_visibility, recipes, users;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    google_id VARCHAR(100) NOT NULL UNIQUE,
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

-- ingredients table
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id)
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
    UNIQUE(recipe_id, tag_id)
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
    UNIQUE(shelf_id, recipe_id)
);

-- profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    bio VARCHAR(250) DEFAULT NULL
);

-- communities table
CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    admin_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);

-- indeces
CREATE INDEX idx_recipes_author_id ON recipes(author_id);
CREATE INDEX idx_recipes_visibility_id ON recipes(visibility_id);
CREATE INDEX idx_recipes_deleted_at ON recipes(deleted_at);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_shelfrecipes_shelf_id ON shelf_recipes(shelf_id);
CREATE INDEX idx_shelves_user_id ON shelves(user_id);
CREATE INDEX idx_shelves_deleted_at ON shelves(deleted_at);
CREATE INDEX idx_communities_admin_id ON communities(admin_id);
CREATE INDEX idx_communities_deleted_at ON communities(deleted_at);

-- Trigger function to auto-update last_updated_at on update
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updating a row in recipes
CREATE TRIGGER set_recipe_last_updated
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();
