const mysql = require('mysql2');

if (process.env.NODE_ENV === 'test') {
    module.exports = {
        query: () => {
            throw new Error('Database query called while NODE_ENV=test. Mock config/db in tests that need database access.');
        },
        end: () => {}
    };
} else {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'library_db'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database: ', err);
            return;
        }
        console.log('Connected to MySQL database.');
    });

    module.exports = connection;
}
