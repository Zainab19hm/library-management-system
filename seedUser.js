const connection = require('./config/db');
const { hashSync, genSaltSync } = require('bcrypt');

const salt = genSaltSync(10);
const hashedPassword = hashSync('password123', salt);

const user = {
    user_name: 'Test User',
    user_email: 'test@user.com',
    user_password: hashedPassword,
    user_type: 'user'
};

connection.query('INSERT IGNORE INTO users SET ?', user, (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log('User seeded:', results);
    }
    process.exit(0);
});
