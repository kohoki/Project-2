const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model')
const User = require('../models/User.model')
const addressDB = require('../models/addresses.model')
const SCart = require('../models/sCart.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

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

router.get('/profile', async (req, res) => {
  try{
    console.log('SESSION =====> ', req.session)
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      const listOfAddresses = await addressDB.find({uId: req.session.user._id});
      //console.log(listOfAddresses);

      res.render('profile', { user, listOfAddresses})

    } else {
    res.redirect('/auth/login')
    }
  } 
  catch (error) {
    console.log(error)
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

router.get('/addAddress', (req, res, next) => {
  res.render('addAddress');
})

// create new Addresse
router.post('/addAddress',async(req, res, next) => {
  const user = req.session.user;
  try {
    await addressDB.create({
      uId: user._id,
      fName: req.body.fName,
      lName: req.body.lName,
      aLine: req.body.aLine,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    })
    res.redirect('/profile');
  } catch (error) {
    console.log(error)
  }
})

// delete Address

router.post('/deleteAddress/:id',async(req, res, next) => {
  
  //console.log(req.params.id)
  try {
    await addressDB.findOneAndDelete({ _id: req.params.id })
    res.redirect('/profile');
  } catch (error) {
    console.log(error)
  }
})

router.post('/addToSchoppingCard/:id',isLoggedIn, async(req, res, next) => {
  
  //console.log("AAAAAAAAAAAA", req.body.quantity)
  //console.log("BBBBBBBBBBBB", req.session.user._id)
  userID = "" + req.session.user._id;
  try {
    const findCard = await SCart.findOneAndUpdate({uId: userID, purchased: "false"}, {$push: {product: {pId: req.params.id, quantity: req.body.quantity}}})
    //{uId: req.session.user._id}
    // , purchased: "false"
    console.log(findCard)
    //res.redirect('/');
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;