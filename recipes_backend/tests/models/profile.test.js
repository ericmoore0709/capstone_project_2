const Profile = require('../../src/models/profile');
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

describe('profile model', () => {
    describe('create', () => {
        it('successfully creates profile', async () => {
            const userId = 1;

            const result = await Profile.create(userId);

            expect(result.userId).toEqual(userId);
            expect(result.bio).toBeNull();
            expect(result.id).toEqual(expect.any(Number))
        });

        it('fails to create duplicate profile', async () => {
            const userId = 1;

            // create the first
            await Profile.create(userId);

            // expect the second creation to throw
            await expect(Profile.create(userId)).rejects.toThrow(ConflictError);
        });
    });

    describe('findByUserId', () => {
        it('successfully finds new profile', async () => {
            const userId = 1;

            // create the profile to retrieve
            await Profile.create(userId);

            // retrive the profile
            const result = await Profile.findByUserId(userId);

            // expect it to exist
            expect(result.id).toEqual(expect.any(Number));
            expect(result.userId).toBe(userId);
            expect(result.bio).toBe(null);
        });

        it('successfully finds edited profile', async () => {
            const userId = 1;
            const bio = 'This is a bio';
            const updateData = { userId, bio };

            // create and update the profile
            await Profile.create(userId);
            await Profile.update(updateData);

            // retrieve the profile
            const result = await Profile.findByUserId(userId);

            // expect profile to exist
            expect(result.id).toEqual(expect.any(Number));
            expect(result.userId).toBe(userId);
            expect(result.bio).toBe(bio);
        });

        it('fails to find profile of user not found', async () => {
            const userId = 999;

            // expect not found to be thrown
            await expect(Profile.findByUserId(userId)).rejects.toThrow(NotFoundError);
        });
    })

    describe('update', () => {
        it('successfully updates profile', async () => {
            const userId = 1;
            const bio = 'This is a bio';

            // create the initial profile
            await Profile.create(userId);

            // update the profile
            const result = await Profile.update({ userId, bio });

            // assert profile has been updated
            expect(result.id).toEqual(expect.any(Number));
            expect(result.userId).toBe(userId);
            expect(result.bio).toBe(bio);
        });

        it('fails to update profile of user not found', async () => {
            const userId = 999;
            const bio = 'This is a bio';

            await expect(Profile.update({ userId, bio })).rejects.toThrow(NotFoundError);
        });
    });

    describe('delete', () => {
        it('successfully deletes profile', async () => {
            const userId = 1;

            // create the profile to delete
            await Profile.create(userId);

            const result = await Profile.delete(userId);
            expect(result.userId).toBe(userId);

            await expect(Profile.findByUserId(userId)).rejects.toThrow(NotFoundError);
        });

        it('fails to delete profile of user not found', async () => {
            const userId = 999;

            await expect(Profile.delete(userId)).rejects.toThrow(NotFoundError);
        });

        it('fails to delete profile already deleted', async () => {
            const userId = 1;

            // create the profile to delete
            await Profile.create(userId);

            // delete the profile
            const result = await Profile.delete(userId);

            // expect profile to not be found 
            await expect(Profile.delete(userId)).rejects.toThrow(NotFoundError);
        });
    });
});