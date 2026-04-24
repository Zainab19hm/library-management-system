jest.mock('../../config/db', () => ({
    query: jest.fn(),
    end: jest.fn()
}));

jest.mock('../../models/book', () => ({
    getBookById: jest.fn(),
    updateStock: jest.fn()
}));
jest.mock('../../models/user', () => ({}));
jest.mock('../../models/order', () => ({
    createOrder: jest.fn()
}));

const Book = require('../../models/book');
const Order = require('../../models/order');
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

    it('should block increase when stock is empty', done => {
        Book.getBookById.mockImplementation((bookId, callback) => {
            callback(null, { book_id: bookId, book_quantity: 0 });
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
                expect(payload).toEqual({ success: false, message: 'Out of Stock' });
                expect(Book.updateStock).not.toHaveBeenCalled();
                done();
            })
        };

        userController.updateCartQuantity(req, res);
    });

    it('should decrease cart quantity and return stock when quantity is above one', done => {
        Book.updateStock.mockImplementation((bookId, change, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const req = {
            params: { bookId: '123' },
            body: { action: 'decrease' },
            session: {
                cart: [{ book_id: '123', quantity: 2 }]
            }
        };
        const res = {
            json: jest.fn(payload => {
                expect(payload.success).toBe(true);
                expect(req.session.cart[0].quantity).toBe(1);
                expect(Book.updateStock).toHaveBeenCalledWith('123', 1, expect.any(Function));
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

    it('should return failure when the cart item is missing', () => {
        const req = {
            params: { bookId: '123' },
            body: { action: 'decrease' },
            session: {
                cart: []
            }
        };
        const res = { json: jest.fn() };

        userController.updateCartQuantity(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false });
    });
});

describe('Unit Test: userController.payForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 when cart is empty', () => {
        const req = {
            user: { id: 7 },
            session: { cart: [] }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userController.payForm(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Cart is empty' });
        expect(Order.createOrder).not.toHaveBeenCalled();
    });

    it('should create order and clear cart when checkout is valid', done => {
        Order.createOrder.mockImplementation((userId, totalPrice, callback) => {
            callback(null, 101);
        });

        const req = {
            user: { id: 7 },
            session: {
                cart: [
                    { book_price: 20, quantity: 2 },
                    { book_price: 15, quantity: 1 }
                ]
            }
        };

        const res = {
            redirect: jest.fn(path => {
                expect(path).toBe('/user/success');
                expect(Order.createOrder).toHaveBeenCalledWith(7, 55, expect.any(Function));
                expect(req.session.cart).toEqual([]);
                done();
            }),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userController.payForm(req, res);
    });
});
