const express = require("express");
const path = require('path')
require('./config/db');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const injectUser = require('./middleware/injectUser');
const app = express();
const port = 5000;

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(injectUser);
app.use(session({
    secret: 'your_secret_key_here',
    resave: true,
    saveUninitialized: true
}));


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// 404 Error Handler - Must be after all other routes
app.use((req, res, next) => {
    res.status(404).render('errors/404');
});

// General Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).render('errors/error', {
        message: err.message || 'Internal Server Error',
        details: err.details || 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log("server up and running on PORT :", port);
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
