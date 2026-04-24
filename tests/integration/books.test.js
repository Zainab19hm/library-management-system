const request = require('supertest');
const app = require('../../index'); // Path to your Express app
const Book = require('../../models/book');

// 1. Mock the DB config
jest.mock('../../config/db', () => ({
    query: jest.fn(),
    end: jest.fn()
}));

// 2. Mock the Auth Middleware to bypass login
jest.mock('../../middleware/authMiddleware', () => (req, res, next) => {
    req.user = { id: 1, name: 'Test User', email: 'test@example.com' };
    next();
});

// 3. Mock the Book Model
jest.mock('../../models/book', () => ({
    getAllBooks: jest.fn(),
    getBookById: jest.fn(),
    updateStock: jest.fn(),
    createBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn()
}));

describe('Integration Test: Books API', () => {

    beforeEach(() => {
        // Clear history of mocks before each test
        jest.clearAllMocks();
    });

    it('GET /user/books should return the catalog page with status 200', async () => {
        // Setup the mock implementation for this specific test
        Book.getAllBooks.mockImplementation((callback) => {
            callback(null, [{
                book_id: 1,
                book_name: 'Clean Code',
                book_category: 'Programming',
                book_author: 'Robert C. Martin',
                book_desc: 'A sample mocked book',
                book_img: 'default.jpg',
                book_price: 20,
                book_quantity: 4
            }]);
        });

        const response = await request(app).get('/user/books');

        expect(response.status).toBe(200);
        expect(Book.getAllBooks).toHaveBeenCalled();
    });

    it('GET /admin/adminLogin should return the admin login page', async () => {
        const response = await request(app).get('/admin/adminLogin');

        expect(response.status).toBe(200);
    });
});