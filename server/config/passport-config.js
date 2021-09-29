/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
const db = require('../db/db-config');

const user = db.user();

const cookieExtracter = (req) => {
    let token = jwt.sign({}, process.env.JWT_SECRET);
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    return token;
};

passport.use(
    new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async (username, password, done) => {
            const isMailValid = await isEmail(username);
            if (isMailValid) {
                user.auth(username, password, (cred) => {
                    if (cred.err) {
                        return done(null, false, { err: cred.err });
                    }
                    return done(null, { soul: cred.soul });
                });
            } else {
                return done(null, false, { err: 'invalid email address' });
            }
        })
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: cookieExtracter,
        secretOrKey: process.env.JWT_SECRET
    },
    (jwt_payload, done) => {
        if (jwt_payload.soul) {
            if (jwt_payload.soul === user._.soul) {
                return done(null, { auth: 'token authenticated' });
            }
            return done(null, false, { err: 'token authentication failed' });
        }
        return done(null, false, { err: 'token authentication failed' });
    })
);

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
        const username = profile._json.email;
        const password = `randomkey${username}`;
        user.create(username, password, () => {
            user.auth(username, password, (creds) => {
                user.get('security').once((data) => {
                    if (data && data.googleID) {
                        if (data.googleID === profile.id) {
                            return done(null, { soul: creds.soul });
                        }
                        return done(null, false, { err: 'google authentication failed' });
                    }
                    user.get('security').put({ googleID: profile.id }, (ack) => {
                        if (ack.ok) {
                            return done(null, { soul: creds.soul });
                        }
                        return done(null, false, { err: 'google signup failed' });
                    });
                });
            });
        });
    })
);

passport.use(
    new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        scope: ['r_liteprofile', 'r_emailaddress'],
        callbackURL: '/api/auth/linkedin/redirect'
    },
    (accesstoken, refreshToken, profile, done) => {
        process.nextTick(async () => {
            const username = profile.emails[0].value;
            const password = `randomkey${username}`;
            user.create(username, password, () => {
                user.auth(username, password, (creds) => {
                    user.get('security').once((data) => {
                        if (data && data.linkedinID) {
                            if (data.linkedinID === profile.id) {
                                return done(null, { soul: creds.soul });
                            }
                            return done(null, false, { err: 'linkedin authentication failed' });
                        }
                        user.get('security').put({ linkedinID: profile.id }, (ack) => {
                            if (ack.ok) {
                                return done(null, { soul: creds.soul });
                            }
                            return done(null, false, { err: 'linkedin signup failed' });
                        });
                    });
                });
            });
        });
    })
);
