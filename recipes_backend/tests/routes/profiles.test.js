const request = require('supertest');
const express = require('express');
const Profile = require('../../src/models/profile');
const app = require('../../app');
const jsonschema = require('jsonschema');
const { NotFoundError, ConflictError } = require('../../expressError');
const db = require('../../db');

beforeEach(async () => {
    await db.query("BEGIN");
});

afterEach(async () => {
    await db.query("ROLLBACK");
    jest.restoreAllMocks();
});

afterAll(async () => {
    await db.end();
});

describe('profiles routes', () => {
    describe('POST /', () => {
        it('successfull adds profile', async () => {
            const user_id = 1;
            const expectedData = { id: 1, userId: user_id, bio: null };

            jest.spyOn(Profile, 'create').mockResolvedValue(expectedData);

            const response = await request(app).post('/profiles/').send({ user_id });

            const profile = response.body.profile;

            expect(response.statusCode).toBe(201);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toBeNull();
        });

        it('fails to add profile already exists', async () => {
            const user_id = 1;

            jest.spyOn(Profile, 'create').mockRejectedValue(new ConflictError(`Profile already exists at userId ${user_id}.`));

            // attempt duplicate post request
            const response = await request(app).post(`/profiles/`).send({ user_id });

            // assert Conflict error
            expect(response.statusCode).toBe(409);
            expect(response.body.error).toContain('already exists');
        });
    });

    describe('GET /:user_id', () => {
        it('successfully retrieves profile (no bio)', async () => {
            const user_id = 1;
            const expectedData = { id: 1, userId: user_id, bio: null };

            jest.spyOn(Profile, 'findByUserId').mockResolvedValue(expectedData);

            const response = await request(app).get(`/profiles/${user_id}`);
            const profile = response.body.profile;
            

            expect(response.statusCode).toBe(200);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toBeNull();
        });

        it('successfully retrieves profile (w bio)', async () => {
            const user_id = 1;
            const expectedData = { id: 1, userId: user_id, bio: 'This is a bio.' };

            jest.spyOn(Profile, 'findByUserId').mockResolvedValue(expectedData);

            const response = await request(app).get(`/profiles/${user_id}`);
            const profile = response.body.profile;

            expect(response.statusCode).toBe(200);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toContain('bio');
        });

        it('fails to retrieve profile from user ID not found', async () => {
            const user_id = 999;

            jest.spyOn(Profile, 'findByUserId').mockRejectedValue(new NotFoundError(`Profile not found at user ID ${user_id}`));

            const response = await request(app).get(`/profiles/${user_id}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });
    });

    describe('PATCH /:user_id', () => {
        it('successfully updates profile', async () => {
            const user_id = 1;
            const bio = 'This is a bio.';
            const expectedData = { id: 1, userId: user_id, bio };

            jest.spyOn(Profile, 'update').mockResolvedValue(expectedData);

            const response = await request(app).patch(`/profiles/${user_id}`).send({ bio });
            const profile = response.body.profile;

            expect(response.statusCode).toBe(200);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toContain('bio');
        });

        it('fails to update profile at user ID not found', async () => {
            const user_id = 999;
            const bio = 'This is a bio.';

            jest.spyOn(Profile, 'update').mockRejectedValue(new NotFoundError(`Profile not found at user ID ${user_id}`));

            const response = await request(app).patch(`/profiles/${user_id}`).send({ bio });

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });
    });

    describe('DELETE /:user_id', () => {
        it('successfully deletes profile (no bio)', async () => {
            const user_id = 1;
            const expectedData = { id: 1, userId: user_id, bio: null };

            jest.spyOn(Profile, 'delete').mockResolvedValue(expectedData);

            const response = await request(app).delete(`/profiles/${user_id}`);
            const profile = response.body.profile;

            expect(response.statusCode).toBe(200);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toBeNull();
        });

        it('successfully deletes profile (w bio)', async () => {
            const user_id = 1;
            const bio = 'This is a bio.';
            const expectedData = { id: 1, userId: user_id, bio };

            jest.spyOn(Profile, 'delete').mockResolvedValue(expectedData);

            const response = await request(app).delete(`/profiles/${user_id}`);
            const profile = response.body.profile;

            expect(response.statusCode).toBe(200);
            expect(profile).not.toBeNull();

            expect(profile.id).toEqual(expect.any(Number));
            expect(profile.userId).toEqual(user_id);
            expect(profile.bio).toContain('bio');
        });

        it('fails to delete profile at user ID not found', async () => {
            const user_id = 999;

            jest.spyOn(Profile, 'delete').mockRejectedValue(new NotFoundError(`Profile not found at user ID ${user_id}`));

            const response = await request(app).delete(`/profiles/${user_id}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toContain('not found');
        });
    });
});