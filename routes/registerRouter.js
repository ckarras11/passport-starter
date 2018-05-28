const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const flash = require('connect-flash');

const router = express.Router();

// Registers a new user in the DB
router.post('/', (req, res) => {
    const name = req.body.name;
    const companyCode = req.body.code;
    const email = req.body.email;
    const password = req.body.password;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Must have a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be between 5 and 72 characters long').isLength({ min: 5, max: 72 });
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    const errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors,
        });
    } else {
        const newUser = new User();
        newUser.name = name;
        newUser.companyCode = companyCode;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        User
            .find({ email })
            .then((user) => {
                // Checks if user already exists
                if (user.length !== 0) {
                    req.flash('error_msg', 'Username Already Exists');
                    res.redirect('/register');
                } else {
                    User.create(newUser);
                    req.flash('success_msg', 'Success, You may now login');
                    res.redirect('/login');
                }
            });
    }
});


module.exports = router;
