const db = require('../config/db');

const Book = {
  createBook(title, category, author, description, image, price, quantity, callback) {
    db.query(
      'INSERT INTO books (book_name, book_category, book_author, book_desc, book_img, book_price, book_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, category, author, description, image, price, quantity],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getAllBooks(callback) {
    db.query('SELECT * FROM books', callback);
  },

  getBookById(bookId, callback) {
    db.query('SELECT * FROM books WHERE book_id = ?', [bookId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);
    });
  },

  updateBook(bookId, data, callback) {
    const { title, category, author, description, image, price, quantity } = data;
    let query = 'UPDATE books SET book_name = ?, book_category = ?, book_author = ?, book_desc = ?, book_price = ?, book_quantity = ?';
    const values = [title, category, author, description, price, quantity];

    if (image) {
      query += ', book_img = ?';
      values.push(image);
    }

    query += ' WHERE book_id = ?';
    values.push(bookId);

    db.query(query, values, callback);
  },

  deleteBook(bookId, callback) {
    db.query('DELETE FROM books WHERE book_id = ?', [bookId], callback);
  }
};

module.exports = Book;
