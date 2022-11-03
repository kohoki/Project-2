const express = require('express');
const router = express.Router();

// get Sign Up

router.get('/signup', (req, res) => {
    res.render('auth/signup')
  })

