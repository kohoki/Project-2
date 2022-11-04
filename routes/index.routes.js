const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model')

/* GET home page */
router.get("/", async(req, res, next) => {
  const product = await Product.find();

  console.log(product)
  res.render("index", {product});
});

router.get('/profile', (req, res) => {
  console.log('SESSION =====> ', req.session)
  if (req.session.user) {
    res.render('profile', { user: req.session.user})
  } else {
    res.redirect('/auth/login')
  }
})

router.get('/create', (req, res, next) => {
  res.render('create');
})

router.post('/create',async(req, res, next) => {
  try {
    await Product.create({
      name: req.body.name,
      region: req.body.region,
      description: req.body.description,
      picture: req.body.picture,
      price: req.body.price,
    })
    res.redirect('/create');
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;