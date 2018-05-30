const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();


passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    function (req, email, password, done) {
        User.findOne({ email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect username or password.' });
              }
            return done(null, user);
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/auth', failureRedirect: '/login', failureFlash: true }),
    function (req, res) {
        next();
    });

module.exports = router;
