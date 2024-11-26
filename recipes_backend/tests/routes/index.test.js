const request = require('supertest');
const express = require('express');
const indexRouter = require('../../src/routes/index');

const app = express();
app.use('/', indexRouter);

describe('GET /', () => {
    it('should respond with JSON containing { title: "Express" }', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ title: 'Express' });
    });
});
