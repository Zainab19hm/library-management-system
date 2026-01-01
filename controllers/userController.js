const User = require('../models/user');
const Book = require('../models/book');
const Order = require('../models/order');
const { hashSync, genSaltSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const userController = {
  register: function (req, res) {
    const { name, email, password, city, phone, gender } = req.body;
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    User.createUser(name, email, hashedPassword, city, phone, gender, (err, userId) => {
      if (err) return res.status(500).json({ error: err });
      res.redirect('/user/userLogin');
    });
  },

  login: function (req, res) {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/user/index');
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  },

  logout: function (req, res) {
    res.clearCookie('token');
    req.session.destroy();
    res.redirect('/user/userLogin');
  },

  getBooksByPopular: function (req, res) {
    Book.getAllBooks((err, books) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch books' });
      res.render('user/index', { books, user: req.user });
    });
  },

  getBookDetails: function (req, res) {
    Book.getAllBooks((err, books) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch books' });
      const cart = req.session.cart || [];
      res.render('user/books', { books, cart, user: req.user });
    });
  },

  getBookDetailsById: function (req, res) {
    const bookId = req.params.bookId;
    Book.getBookById(bookId, (err, book) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch book' });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.render('user/book_details', { book, user: req.user });
    });
  },

  addToCart: function (req, res) {
    const bookId = req.body.bookId;
    Book.getBookById(bookId, (err, book) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch book' });
      if (!book) return res.status(404).json({ error: 'Book not found' });

      if (!req.session.cart) req.session.cart = [];
      const existing = req.session.cart.find(item => item.book_id === book.book_id);
      if (existing) existing.quantity += 1;
      else {
        book.quantity = 1;
        req.session.cart.push(book);
      }

      res.json({ success: true, cart: req.session.cart });
    });
  },

  getCart: function (req, res) {
    const cart = req.session.cart || [];
    res.render('user/cart', { cart, user: req.user });
  },

  updateCartQuantity: function (req, res) {
    const { bookId } = req.params;
    const { action } = req.body;
    const cart = req.session.cart || [];
    const item = cart.find(i => i.book_id == bookId);

    if (item) {
      if (action === 'increase') item.quantity += 1;
      else if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;
      return res.json({ success: true, cart });
    }
    res.json({ success: false });
  },

  removeFromCart: function (req, res) {
    const { bookId } = req.params;
    const cart = req.session.cart || [];
    const index = cart.findIndex(i => i.book_id == bookId);
    if (index > -1) {
      cart.splice(index, 1);
      return res.json({ success: true, cart });
    }
    res.json({ success: false });
  },

  checkout: function (req, res) {
    const cart = req.session.cart || [];
    res.render('user/checkout', { cart, user: req.user });
  },

  payForm: function (req, res) {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const totalPrice = cart.reduce((sum, item) => sum + item.book_price * item.quantity, 0);
    Order.createOrder(req.user.id, totalPrice, (err, orderId) => {
      if (err) return res.status(500).json({ error: 'Failed to create order' });
      req.session.cart = [];
      res.redirect('/user/success');
    });
  },

  getFilteredBooks: function (req, res) {
    const { category, author } = req.query;
    Book.getAllBooks((err, books) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch books' });
      const filtered = books.filter(book =>
        (!category || book.book_category === category) &&
        (!author || book.book_author === author)
      );
      res.json(filtered);
    });
  }
};

module.exports = userController;
