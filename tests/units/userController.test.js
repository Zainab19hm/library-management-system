jest.mock('../../config/db', () => ({
    query: jest.fn(),
    end: jest.fn()
}));

jest.mock('../../models/book', () => ({
    getBookById: jest.fn(),
    updateStock: jest.fn()
}));
jest.mock('../../models/user', () => ({}));
jest.mock('../../models/order', () => ({}));

const Book = require('../../models/book');
const userController = require('../../controllers/userController');

describe('Unit Test: userController.updateCartQuantity', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should increase cart quantity successfully when stock is available', done => {
        Book.getBookById.mockImplementation((bookId, callback) => {
            callback(null, { book_id: bookId, book_quantity: 5 });
        });
        Book.updateStock.mockImplementation((bookId, change, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const req = {
            params: { bookId: '123' },
            body: { action: 'increase' },
            session: {
                cart: [{ book_id: '123', quantity: 1 }]
            }
        };
        const res = {
            json: jest.fn(payload => {
                expect(payload.success).toBe(true);
                expect(req.session.cart[0].quantity).toBe(2);
                expect(Book.getBookById).toHaveBeenCalledWith('123', expect.any(Function));
                expect(Book.updateStock).toHaveBeenCalledWith('123', -1, expect.any(Function));
                done();
            })
        };

        userController.updateCartQuantity(req, res);
    });

    it('should return a failure response for an invalid action', () => {
        const req = {
            params: { bookId: '123' },
            body: { action: 'invalid_action' },
            session: {
                cart: [{ book_id: '123', quantity: 1 }]
            }
        };
        const res = { json: jest.fn() };

        userController.updateCartQuantity(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false });
        expect(req.session.cart[0].quantity).toBe(1);
        expect(Book.getBookById).not.toHaveBeenCalled();
        expect(Book.updateStock).not.toHaveBeenCalled();
    });
});
