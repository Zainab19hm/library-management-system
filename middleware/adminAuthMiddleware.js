// Middleware for admin authentication. It ensures that only users with admin privileges can access certain routes and functionalities in the admin panel.

function requireLogin(req, res, next) {
    if (req.session && req.session.loggedin && req.session.username) {
        next();
    } else {
        res.redirect('/admin/adminLogin');
    }
}

module.exports = requireLogin;
