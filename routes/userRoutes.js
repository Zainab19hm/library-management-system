const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/register', (req, res) => res.render('user/register'));
router.post('/register', userController.register);

router.get('/userLogin', (req, res) => res.render('user/login'));
router.post('/userLogin', userController.login);

router.get('/index', authenticateToken, userController.getBooksByPopular);
router.get('/books', authenticateToken, userController.getBookDetails);
router.get('/books/:bookId', authenticateToken, userController.getBookDetailsById);

router.post('/cart', authenticateToken, userController.addToCart);
router.get('/cart', authenticateToken, userController.getCart);
router.post('/cart/update/:bookId', authenticateToken, userController.updateCartQuantity);
router.post('/cart/remove/:bookId', authenticateToken, userController.removeFromCart);

router.get('/checkout', authenticateToken, userController.checkout);
router.post('/pay', authenticateToken, userController.payForm);

router.get('/filterBooks', authenticateToken, userController.getFilteredBooks);

module.exports = router;
