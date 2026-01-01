const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AdminController = require('../controllers/adminController');
const requireLogin = require('../middleware/adminAuthMiddleware');
const Book = require('../models/book');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Admin login
router.get('/adminLogin', (req, res) => res.render('admin/login'));
router.post('/adminLogin', AdminController.login);
// تسجيل الدخول للأدمن هنا بنفس الكود السابق أو استخدام Passport

router.get('/dashboard', requireLogin, AdminController.allUsers);
router.get('/userOrders/:userId', requireLogin, AdminController.getUserOrders);

router.get('/addBook', requireLogin, (req, res) => {
    Book.getAllBooks((err, books) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch books' });
        res.render('admin/addBook', { books });
    });
});

router.post('/addBook', requireLogin, upload.single('image'), AdminController.addBook);
router.post('/updateBook/:bookId', requireLogin, upload.single('image'), AdminController.updateBook);
router.get('/getBookDetails/:bookId', requireLogin, AdminController.getBookDetails);
router.delete('/deleteBook/:bookId', requireLogin, AdminController.deleteBook);

router.get('/allOrders', requireLogin, AdminController.allOrders);
router.post('/updateOrder/:orderId', requireLogin, AdminController.updateOrderStatus);

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/adminLogin');
});

module.exports = router;
