/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { isEmail } = require('validator');
const db = require('../db/db-config');
const { GoogleAPI, LinkedInAPI, JWT } = require('./auth-keys');

const user = db.user();

const cookieExtracter = (req) => {
    if (req && req.cookies) {
        return req.cookies.jwt;
    }
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
                    if (cred.err) { return done(null, false, cred); }
                    return done(null, { soul: cred.soul });
                });
            } else { return done(null, false, { err: 'invalid email address' }); }
        })
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: cookieExtracter,
        secretOrKey: JWT.jwtSecret
    },
    (jwt_payload, done) => {
        if (jwt_payload.soul === user._.soul) { return done(null, { auth: 'token authenticated' }); }
        return done(null, false, { err: 'token authentication failed' });
    })
);

passport.use(
    new GoogleStrategy({
        clientID: GoogleAPI.clientID,
        clientSecret: GoogleAPI.clientSecret,
        callbackURL: '/api/auth/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
        const username = profile._json.email;
        const password = GoogleAPI.clientSecret + username + profile.id;
        user.auth(username, password, (cred) => {
            if (cred.err) {
                user.create(username, password, (key) => {
                    if (key.err) { return done(null, false, { err: 'google authentication failed' }); }
                    user.auth(username, password, (creds) => {
                        if (creds.err) { return done(null, false, creds); }
                        return done(null, { soul: creds.soul });
                    });
                });
            } else { return done(null, { soul: cred.soul }); }
        });
    })
);

passport.use(
    new LinkedInStrategy({
        clientID: LinkedInAPI.clientID,
        clientSecret: LinkedInAPI.clientSecret,
        scope: ['r_liteprofile', 'r_emailaddress'],
        callbackURL: '/api/auth/linkedin/redirect'
    },
    (accesstoken, refreshToken, profile, done) => {
        process.nextTick(async () => {
            const username = profile.emails[0].value;
            const password = LinkedInAPI.clientSecret + username + profile.id;
            user.auth(username, password, (cred) => {
                if (cred.err) {
                    user.create(username, password, (key) => {
                        if (key.err) { return done(null, false, { err: 'linkedin authentication failed' }); }
                        user.auth(username, password, (creds) => {
                            if (creds.err) { return done(null, false, creds); }
                            return done(null, { soul: creds.soul });
                        });
                    });
                } else { return done(null, { soul: cred.soul }); }
            });
        });
    })
);
