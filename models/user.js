const db = require('../config/db');

const User = {
  createUser(name, email, password, city, phone, gender, callback) {
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) return callback('Email already registered');

      db.query(
        'INSERT INTO users (name, email, password, city, phone, gender) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, password, city, phone, gender],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    });
  },

  findByEmail(email, callback) {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  getAllUsers(callback) {
    db.query('SELECT * FROM users', callback);
  },

  getUserById(userId, callback) {
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  }
};

module.exports = User;
