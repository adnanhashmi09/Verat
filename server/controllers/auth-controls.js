const db = require('../db/db-config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT } = require('../config/auth-keys');
const { isEmail } = require('validator');

const user = db.user();

const genJWT = async (soul) => {
    const token = await jwt.sign( soul, JWT.jwtSecret );
    return token;
}

module.exports.signup = async (req,res) => {
    const { email, password } = req.body;
    const isMailValid = isEmail(email);
    if(isMailValid) {
        try {
            await user.create(email, password, async key => {
                if(key.err) { return res.json( {err: key.err} ) }
                try {
                    await user.auth(email, password, async cred => {
                        if(cred.err) { return res.json(cred) }
                        const token = await genJWT({ soul: cred.soul });
                        return res
                            .cookie('jwt', token, { httpOnly: true })
                            .json({soul: cred.soul}); 
                    })
                }
                catch(err) {}
            });
        }
        catch(err) {}
    }
    else { res.json({err: 'invalid mail entered'}); }
}

module.exports.login = (req,res) => {
    debugger;
    passport.authenticate('local', {session: false}, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        const token = await genJWT(User);
        return res
                .cookie('jwt', token, { httpOnly: true })
                .json(User);
      })(req, res);
}

module.exports.gSignin = async (req,res) => {
    await passport.authenticate('google', {session: false}, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        try {
            const token = await genJWT(User);
            return res
                    .cookie('jwt', token, { httpOnly: true })
                    .redirect('http://localhost:3000/dashboard');
        }
        catch(err) {
            console.log(err);
        }
      })(req, res);
}

module.exports.ldSignin = (req,res) => {
    passport.authenticate('linkedin', {session: false}, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        const token = await genJWT(User);
        res.cookie('jwt', token, { httpOnly: true })
        debugger;
        return res.redirect('http://localhost:3000/dashboard');
      })(req, res);
}

module.exports.logout = async (req,res) => {
    passport.authenticate('jwt', {session: false}, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        await user.leave();
        if(user['_'].sea) { return res.json({err: 'logout failed'}); }
        return res  
                .cookie('jwt', '', { httpOnly: true, maxAge: 1 })
                .json({logout: 'successful'});
      })(req, res);
}

module.exports.authUser = async (req,res) => {
    passport.authenticate('jwt', {session: false}, async (err, User, info) => {
        if (err) { return res.json(err); }
        if (!User) { return res.json(info); }
        return res.json(User);
      })(req, res);
}


