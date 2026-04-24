const connection = require('./config/db');

const book = {
    book_id: 'TEST_BOOK_1',
    book_name: 'Test Playwright Book',
    book_author: 'Test Author',
    book_category: 'Action',
    book_price: 10.99,
    book_desc: 'Test description',
    book_img: 'default.jpg'
};

connection.query('INSERT IGNORE INTO books SET ?', book, (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Book seeded:', results);
    }
    process.exit(0);
});
