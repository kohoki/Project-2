const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    // let randomNumbers = [];
    // while (randomNumbers.length < 4) {
    //   let number = Math.floor(Math.random() * (product.length - 1) + 1);
    //   if (randomNumbers.indexOf(number) === -1) {
    //     randomNumbers.push(number);
    //   }
    // }
    // let randomProducts = [];
    // randomNumbers.forEach(element => {
    //   randomProducts.push(product[element])
    // });
    
    console.log(allProducts)
    res.render("index", {allProducts});
  } catch (error) {
    console.log(error)
  }
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
      date: req.body.date,
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

// Render the shopping-cart view
router.get('/shopping-cart', (req, res, next) => {
  res.render('shopping-cart');
})

// Create the shopping-cart following the model
router.post('/shopping-cart', async (req, res, next) => {
  try {
  
  } catch (error) {
    
  }
})

router.get('/add-to-cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = req.session.user._id;
  await Cart.findOneAndUpdate({ user: userId }, { $push: { products: productId } });
  res.redirect('/');
})

module.exports = router;