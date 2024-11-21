const { EnumUserRoles } = require('../helpers/constants');
const logging = require('../helpers/logging');

const NAMESPACE = 'AUTH';

const AuthAdmin = function (req, res, next) {
    // your validation code goes here.
    logging.info(NAMESPACE, 'AuthAdmin', 'Authenticating Request');
    var isAuthenticated = false;
    if (req.session.loggedInUser && req.session.loggedInUser.roleId == EnumUserRoles.SuperAdmin) {
        isAuthenticated = true;
    }

    if (isAuthenticated) {
        next();
    } else {
        res.redirect('/admin');
    }
};

module.exports = { AuthAdmin };
