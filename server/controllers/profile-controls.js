/* eslint-disable new-cap */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const db = require('../db/db-config');
const User = require('../db/userSchema');

const user = db.user();

module.exports.setup = (req, res) => {
    const { soul } = user._;
    user.get('company').once((info) => {
        const { refCode, admin } = info;
        const details = req.body;
        details.photo = req.file ? req.file.path : 'uploads/profiles/profile.jpg';
        if (refCode) {
            const newUser = new User({
                soul,
                refCode,
                review: admin,
                firstName: details.firstName,
                lastName: details.lastName,
                email: details.email,
                title: details.title,
                photo: details.photo
            });
            details.title = null;
            newUser.save()
                .then((obj) => {
                    db.get('companies').get(refCode).get('employees').get(soul)
                    .put(details, (ack) => {
                        if (ack.err) {
                            User.findOneAndDelete({ soul })
                                .then((result) => res.json({ err: 'profile setup failed' }))
                                .catch((err) => {
                                    console.log(err);
                                    return res.json({ err: 'deletion from db failed' });
                                });
                        }
                        return res.json({ message: 'profile setup successful' });
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.json({ err: 'profile setup failed' });
                });
        } else {
            return res.json({ err: 'company' });
        }
    });
};

module.exports.update = (req, res) => {
    const { soul } = user._;
    user.get('company').once((info) => {
        if (info) {
            const { refCode } = info;
            db.get('companies').get(refCode).get('employees')
                .get(soul)
                .put(req.body, (ack) => {
                    if (ack.err) {
                        return res.json({ err: 'failure' });
                    }
                    return res.json({ message: 'success' });
                });
        } else {
            return res.json({ err: 'company' });
        }
    });
};

module.exports.approve = (req, res) => {
    const { userSoul, userPermissions, title } = req.body;
    console.log(req.body);
    User.findOneAndUpdate({ soul: userSoul }, {
        permissions: userPermissions,
        title,
        review: true
    }, { new: true })
        .then((obj) => {
            console.log(obj);
            return res.json({ message: 'success' });
        })
        .catch(() => res.json({ err: 'wrtiting to db failed' }));
};

module.exports.fetchDetails = (req, res) => {
    const { soul } = user._;
    user.get('company').once((info) => {
        if (info) {
            const { refCode, admin } = info;
            User.findOne({ soul, refCode })
                .then((obj) => {
                    db.get('companies').get(refCode).get('employees')
                        .get(soul)
                        .once((data) => {
                            if (data) {
                                const { review, title } = obj;
                                const details = { ...data, review, title };
                                console.log(details);
                                details.admin = admin;
                                return res.json({ details });
                        }
                        return res.json({ err: 'profile' });
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.json({ err: 'db query failed' });
                });
        } else {
            return res.json({ err: 'company' });
        }
    });
};
