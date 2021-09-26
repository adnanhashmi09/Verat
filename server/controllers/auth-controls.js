/* eslint-disable consistent-return */

const passport = require('passport');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
const db = require('../db/db-config');

const user = db.user();

const genJWT = async (soul) => {
    const token = jwt.sign(soul, process.env.JWT_SECRET);
    return token;
};

module.exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const isMailValid = await isEmail(email);
        if (isMailValid) {
            user.create(email, password, (key) => {
                if (key.err) { return res.json({ err: key.err }); }
                user.auth(email, password, async (cred) => {
                    if (cred.err) { return res.json(cred); }
                    const token = await genJWT({ soul: cred.soul });
                    return res
                        .cookie('jwt', token, { httpOnly: true })
                        .json({ soul: cred.soul });
                });
            });
        } else { res.json({ err: 'invalid mail entered' }); }
    } else { res.json({ err: 'Missing credentials' }); }
};

module.exports.login = (req, res) => {
    passport.authenticate('local', { session: false }, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        const token = await genJWT(User);
        return res
                .cookie('jwt', token, { httpOnly: true })
                .json(User);
      })(req, res);
};

module.exports.gSignin = async (req, res) => {
    await passport.authenticate('google', { session: false }, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        const token = await genJWT(User);
        return res
                .cookie('jwt', token, { httpOnly: true })
                .redirect('http://localhost:3000/dashboard');
      })(req, res);
};

module.exports.ldSignin = (req, res) => {
    passport.authenticate('linkedin', { session: false }, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        const token = await genJWT(User);
        return res
                    .cookie('jwt', token, { httpOnly: true })
                    .redirect('http://localhost:3000/dashboard');
      })(req, res);
};

module.exports.logout = async (req, res) => {
    passport.authenticate('jwt', { session: false }, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        user.leave();
        if (user._.sea) { return res.json({ err: 'logout failed' }); }
        return res
                .cookie('jwt', '', { httpOnly: true, maxAge: 1 })
                .json({ logout: 'successful' });
      })(req, res);
};

module.exports.authUser = async (req, res) => {
    passport.authenticate('jwt', { session: false }, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        return res.json(User);
      })(req, res);
};
