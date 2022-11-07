const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model')
const User = require('../models/User.model')

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


router.post('/profile', async (req, res) => {
  const user = req.session.user;
  const { fName, lName, email, credit} = req.body;
  
  try {
    await User.findByIdAndUpdate(user._id,
      {fName, lName, email, credit}, { new: true });
      res.redirect('/profile');
    }
  
  catch (error) {
    console.log(error)
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

module.exports = router;