const express = require('express');
const router = express.Router();
const SCart = require('../models/sCart.model')
const User = require('../models/User.model')
const Cart = require('../models/Cart.model')
const bcrypt = require('bcryptjs')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// get Sign Up

router.get('/signup', (req, res) => {
  //console.log('SESSION =====> ', req.session)
  res.render('auth/signup')
})

/* POST Signup data */
router.post('/signup', async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })

    await Cart.create({
      user: newUser._id
    })

    res.redirect('/auth/login')
  } catch (error) {
    console.log(error.message)
    res.render('auth/signup', { errorMessage: 'Username or e-mail already taken' })
  }
})

/* GET Login page */

router.get('/login', (req, res) => {
  res.render('auth/login')
})

/* POST Login data */

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const currentUser = await User.findOne({ username })
  if (!currentUser) {
    // What to do if I don't have a user with this username
    res.render('auth/login', { errorMessage: 'No user with this username' })
  } else {
    // console.log('Found User', currentUser)
    if (bcrypt.compareSync(password, currentUser.password)) {
      console.log('Correct password')
      // What to do if I have a user and the correct password
      /* const sessionUser = structuredClone(currentUser)
      delete sessionUser.password */
      req.session.user = currentUser
      findSCard = await SCart.find({uId: req.session.user._id, purchased: "false"})
      //console.log("AAAAAAAAAAAAAAAAAAAAAAA", findSCard)
      // if there is no Schooping Card - please create
       if(findSCard.length < 1)
       {
        await SCart.create({
          uId: req.session.user._id
        })
        
       }
      res.redirect('/profile')
    } else {
      // What to do if I have a user and an incorrect password
      res.render('auth/login', { errorMessage: 'Incorrect password !!!' })
    }
  }
  }
  catch (error) {
    console.log(error)
  }
  
})
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });


})


module.exports = router;