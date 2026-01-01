const db = require('../config/db');

const Order = {
  createOrder(userId, totalPrice, callback) {
    db.query('INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)', [userId, totalPrice, 'pending'], (err, result) => {
      if (err) return callback(err);
      callback(null, result.insertId);
    });
  },

  getOrdersByUser(userId, callback) {
    db.query('SELECT * FROM orders WHERE user_id = ?', [userId], callback);
  },

  getAllOrders(callback) {
    db.query('SELECT * FROM orders', callback);
  },

  updateOrderStatus(orderId, status, callback) {
    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], callback);
  }
};

module.exports = Order;
