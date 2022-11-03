const express = require('express');
const router = express.Router();

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// get Sign Up

router.get('/signup', isLoggedOut, (req, res) => {
    console.log('SESSION =====> ', req.session)
    res.render('auth/signup')
  })

  module.exports = router;
