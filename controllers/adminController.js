const Book = require('../models/book');
const User = require('../models/user');
const Order = require('../models/order');

const AdminController = {
  allUsers: function (req, res) {
    User.getAllUsers((err, users) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch users' });
      res.render('admin/dashboard', { users });
    });
  },

  login: function (req, res) {
    const { username, password } = req.body;
    const db = require('../config/db');
    const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error(err);
        return res.render('admin/login', { error: 'An error occurred' });
      }
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = results[0].username;
        req.session.adminId = results[0].id;
        return res.redirect('/admin/dashboard');
      } else {
        return res.render('admin/login', { error: 'Invalid credentials' });
      }
    });
  },

  getUserOrders: function (req, res) {
    const userId = req.params.userId;
    User.getUserById(userId, (err, user) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch user' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      Order.getOrdersByUser(userId, (err, orders) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
        res.render('admin/viewOrders', { user, orders });
      });
    });
  },

  addBook: function (req, res) {
    const { title, category, author, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    Book.createBook(title, category, author, description, image, price, quantity, (err, bookId) => {
      if (err) return res.status(500).json({ error: 'Failed to add book' });
      Book.getAllBooks((err, books) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch books' });
        res.render('admin/addBook', { books });
      });
    });
  },

  getBookDetails: function (req, res) {
    const bookId = req.params.bookId;
    Book.getBookById(bookId, (err, book) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch book' });
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    });
  },

  updateBook: function (req, res) {
    const bookId = req.params.bookId;
    const { title, category, author, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    const data = { title, category, author, description, price, quantity, image };
    Book.updateBook(bookId, data, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update book' });
      res.redirect('/admin/addBook');
    });
  },

  deleteBook: function (req, res) {
    const bookId = req.params.bookId;
    Book.deleteBook(bookId, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete book' });
      res.status(204).end();
    });
  },

  allOrders: function (req, res) {
    Order.getAllOrders((err, orders) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
      res.render('admin/allOrders', { orders });
    });
  },

  updateOrderStatus: function (req, res) {
    const orderId = req.params.orderId;
    const { status } = req.body;
    Order.updateOrderStatus(orderId, status, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update order' });
      res.redirect('/admin/allOrders');
    });
  }
};

module.exports = AdminController;
