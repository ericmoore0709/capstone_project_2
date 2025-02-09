const request = require('supertest');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = require('../../app');
const sinon = require('sinon');
const User = require('../../src/models/user');

describe('OAuth Routes', () => {
    let jwtSignStub;

    beforeAll(() => {
        // Stub JWT signing to avoid actual token generation
        jwtSignStub = sinon.stub(jwt, 'sign').returns('mocked-token');
    });

    afterAll(() => {
        jwtSignStub.restore();
    });

    describe('GET /google', () => {
        it('should initiate Google OAuth', async () => {
            const res = await request(app).get('/auth/google');
            expect(res.status).toBe(302); // 302 redirect status
            expect(res.headers.location).toContain('accounts.google.com');
        });
    });

    describe('GET /google/callback', () => {
        beforeEach(() => {
            // Mock passport to automatically invoke `next` middleware in callback
            sinon.stub(passport, 'authenticate').callsFake((strategy, options) => (req, res, next) => {
                req.user = { id: 1, googleId: 'google123', email: 'user@example.com', firstName: 'John', lastName: 'Doe' };
                next();
            });
        });

        afterEach(() => {
            passport.authenticate.restore();
        });

        it('should redirect to client URL with JWT on success', async () => {
            sinon.stub(User, 'getByEmail').returns({ id: 1, googleId: 'google123', email: 'user@example.com', firstName: 'John', lastName: 'Doe' });
            sinon.stub(User, 'getById').returns({ id: 1, googleId: 'google123', email: 'user@example.com', firstName: 'John', lastName: 'Doe' });

            const res = await request(app).get('/auth/google/callback');
            expect(res.status).toBe(302);
            expect(res.headers.location).toContain(`${process.env.CLIENT_BASE_URL}?token=mocked-token`);
        });

        it('should redirect to client URL with error on failure', async () => {
            passport.authenticate.restore();
            sinon.stub(passport, 'authenticate').callsFake((strategy, options) => (req, res) => {
                res.redirect(`${process.env.CLIENT_BASE_URL}?error=authentication_failed`);
            });

            const res = await request(app).get('/auth/google/callback');
            expect(res.status).toBe(302);
            expect(res.headers.location).toContain(`${process.env.CLIENT_BASE_URL}?error=authentication_failed`);
        });
    });
});
