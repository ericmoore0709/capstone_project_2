const User = require('../../src/models/user');
const db = require('../../db');
const { BadRequestError, NotFoundError } = require('../../expressError');
const fs = require('fs');
const path = require('path');
const { setupTests, resetDatabase, teardownTests, populateTables } = require('../commonSetup');

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

describe("User model", () => {

    describe("register", () => {
        test("successfully registers a new user", async () => {
            const user = await User.register({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google123",
                image: "http://example.com/image.jpg",
            });
            expect(user).toEqual({
                id: expect.any(Number),
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google123",
                image: "http://example.com/image.jpg",
            });
        });

        test("throws BadRequestError on duplicate email", async () => {
            await User.register({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google123",
            });
            await expect(User.register({
                firstName: "Jane",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google456",
            })).rejects.toThrow(BadRequestError);
        });
    });

    describe("findAll", () => {
        test("retrieves all users", async () => {
            await User.register({ firstName: "John", lastName: "Doe", email: "john@example.com", googleId: "google123" });
            await User.register({ firstName: "Jane", lastName: "Doe", email: "jane@example.com", googleId: "google456" });
            const users = await User.findAll();
            expect(users.length).toBe(3); // these two plus the one common insertion
            expect(users[0]).toHaveProperty("id");
            expect(users[0]).toHaveProperty("firstName");
        });
    });

    describe("getByEmail", () => {
        test("retrieves a user by email", async () => {
            await User.register({ firstName: "John", lastName: "Doe", email: "john@example.com", googleId: "google123" });
            const user = await User.getByEmail("john@example.com");
            expect(user).toEqual(expect.objectContaining({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google123",
            }));
        });

        test("returns null if user does not exist", async () => {
            const user = await User.getByEmail("nope@example.com");
            expect(user).toBeNull();
        });
    });

    describe("getById", () => {
        test("retrieves a user by ID", async () => {
            const newUser = await User.register({ firstName: "John", lastName: "Doe", email: "john@example.com", googleId: "google123" });
            const user = await User.getById(newUser.id);
            expect(user).toEqual(expect.objectContaining({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                googleId: "google123",
            }));
        });

        test("throws NotFoundError if user not found", async () => {
            await expect(User.getById(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("update", () => {
        test("successfully updates user data", async () => {
            const newUser = await User.register({ firstName: "John", lastName: "Doe", email: "john@example.com", googleId: "google123" });
            const updatedUser = await User.update(newUser.id, { firstName: "Johnny" });
            expect(updatedUser.firstName).toBe("Johnny");
            expect(updatedUser.email).toBe("john@example.com");
        });

        test("throws NotFoundError if user not found", async () => {
            await expect(User.update(0, { firstName: "Jane" })).rejects.toThrow(NotFoundError);
        });
    });

    describe("softDelete", () => {
        test("soft deletes a user by setting deleted_at", async () => {
            const newUser = await User.register({ firstName: "John", lastName: "Doe", email: "john@example.com", googleId: "google123" });
            await User.softDelete(newUser.id);
            await expect(User.getById(newUser.id)).rejects.toThrow(NotFoundError);
        });

        test("throws NotFoundError if user not found", async () => {
            await expect(User.softDelete(-1)).rejects.toThrow(NotFoundError);
        });
    });
});
