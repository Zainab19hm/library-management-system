const request = require('supertest');

jest.mock('../../config/db', () => ({
    query: jest.fn(),
    end: jest.fn()
}));

const app = require('../../index');

describe('Integration Test: Core app routes and errors', () => {
    it('GET / should render home page', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Library Management System');
    });

    it('GET /missing-route should render 404 page', async () => {
        const response = await request(app).get('/missing-route');

        expect(response.status).toBe(404);
    });
});
