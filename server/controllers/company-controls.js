/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const rcg = require('referral-code-generator');
const db = require('../db/db-config');
const User = require('../db/userSchema');

const user = db.user();

module.exports.register = (req, res) => {
    const {
        name, id, strength, contact, email, year
    } = req.body;
    const { path } = req.file;
    const key = name.split(' ').join('');
    const refCode = rcg.custom('lowercase', 6, 8, key);
    const details = {
        name,
        id,
        strength,
        refCode,
        contact,
        email,
        year,
        logo: path
    };
    db.get('companies').get(refCode).put(details, (ack) => {
        if (ack.err) {
            return res.json({ err: 'Company signup failed' });
        }
        user.get('company').put({
            refCode,
            admin: true
        },
        (info) => {
            if (info.err) {
                return res.json({ err: 'user enrollment failed' });
            }
            return res.json(details);
        });
    });
};

module.exports.enroll = (req, res) => {
    const { refCode } = req.body;
    db.get('companies').once((data) => {
        console.log(data);
        console.log(data[refCode]);
        if (data[refCode]) {
            user.get('company').put({
                refCode,
                admin: false
            },
            (ack) => {
                if (ack.err) {
                    return res.json({ err: 'user enrollment failed' });
                }
                return res.json({ message: 'user enrollment successful' });
            });
        } else {
            return res.json({ err: 'Referral Code is invalid' });
        }
    });
};

module.exports.fetchDetails = (req, res) => {
    user.get('company').once((info) => {
        if (info) {
            const { refCode } = info;
            db.get('companies').get(refCode).once((details) => res.json({ details }));
        } else {
            return res.json({ err: 'not registered' });
        }
    });
};

module.exports.employees = async (req, res) => {
    const details = {};
    user.get('company').once(async (info) => {
        if (info) {
            const { refCode } = info;
            try {
                const complete = await User.find({ review: true, refCode });
                details.complete = complete;
                try {
                    const pending = await User.find({ review: false, refCode });
                    details.pending = pending;
                    return res.json({ details });
                } catch (err) {
                    console.log(err);
                    return res.json({ err: 'db query failed' });
                }
            } catch (err) {
                console.log(err);
                return res.json({ err: 'db query failed' });
            }
        } else {
            return res.json({ err: 'company' });
        }
    });
};

module.exports.fetchProf = (req, res) => {
    const { soul } = req.body;
    User.findOne({ soul })
        .then((data) => {
            res.json({ data });
        })
        .catch((err) => {
            console.log(err);
            res.json({ err: 'db query failed' });
        });
};

module.exports.fetchEmployee = (req, res) => {
    const { soul } = req.body;
    user.get('company').once((info) => {
        if (info) {
            const { refCode } = info;
            db.get('companies').get(refCode).get('employees')
                .get(soul)
                .once((data) => {
                    if (data) {
                        return res.json({ data });
                    }
                    return res.json({ err: 'Invalid Employee ID' });
                });
        } else {
            return res.json({ err: 'company' });
        }
    });
};
