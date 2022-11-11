const express = require('express');
const router = express.Router();
const SCart = require('../models/sCart.model')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/*------------------ // SIGN UP ------------------*/

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

    res.redirect('/auth/login')
  } catch (error) {
    console.log(error.message)
    res.render('auth/signup', { errorMessage: 'Username or e-mail already taken' })
  }
})

/*------------------ // LOGIN ------------------*/

router.get('/login',isLoggedOut, (req, res) => {
  res.render('auth/login')
})

/* POST Login data */

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const currentUser = await User.findOne({ username })
  if (!currentUser) {
    res.render('auth/login', { errorMessage: 'No user with this username' })
  } else {
    if (bcrypt.compareSync(password, currentUser.password)) {
      console.log('Correct password')
      req.session.user = currentUser
      findSCard = await SCart.find({uId: req.session.user._id, purchased: "false"})
      // if there is no Schooping Card - please create
       if(findSCard.length < 1)
       {
        await SCart.create({
          uId: req.session.user._id
        })
       }
      res.redirect('/profile')
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password !!!' })
    }
  }
  }
  catch (error) {
    console.log(error)
  }
})

/*------------------ // LOGOUT ------------------*/

router.get('/logout',isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
})


module.exports = router;