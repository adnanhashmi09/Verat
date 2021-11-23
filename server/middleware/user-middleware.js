/* eslint-disable consistent-return */
const db = require('../db/db-config');
const User = require('../db/userSchema');

const user = db.user();

module.exports.checkReview = (req, res, next) => {
    const { soul } = user._;
    User.findOne({ soul })
        .then((obj) => {
            if (obj.review) {
                next();
            } else {
                return res.json({ err: 'Account is not approved' });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.json({ err: 'Authentication failed' });
        });
};

module.exports.checkPermissions = (perm) => ((req, res, next) => {
    const { soul } = user._;
    User.findOne({ soul })
        .then((obj) => {
            if (obj.review && obj.permissions[perm]) {
                next();
            } else {
                return res.json({ err: 'Account is not authorised' });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.json({ err: 'authentication failed' });
        });
    }
);
