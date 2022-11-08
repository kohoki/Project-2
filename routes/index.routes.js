const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model')
const Cart = require('../models/Cart.model')
const User = require('../models/User.model')
const addressDB = require('../models/addresses.model')

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
    
    res.render("index", { allProducts });
  } catch (error) {
    console.log(error)
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const products = await Product.find();
    const regionsArr = [];
    const datesArr = [];
    // const colorsArr = [];

    products.forEach(product => {
      const region = product.region;
      const date = product.date;
      if (!regionsArr.includes(region)) {
        regionsArr.push(region);
      }
      if (!datesArr.includes(date)) {
        datesArr.push(date);
      }
      // if (!colorsArr.includes(color)) {
      //   colorsArr.push(color);
      // }
    })
    
    regionsArr.sort();
    datesArr.sort();
    // colorsArr.sort();

    res.render('search', {regionsArr, datesArr, /*colorsArr*/})
  } catch (error) {
    console.log(error);
  }
})

router.post('/search', async (req, res, next) => {
  const { region, date } = req.body;
  let searchResult;
  if (region !== '' && date !== ''){
    searchResult = await Product.find({ region: region, date: date })
  } else if (region !== '' && date === '') {
    searchResult = await Product.find({ region: region })
  } else if (region === '' && date !== '') {
    searchResult = await Product.find({ date: date })
  }

  console.log(searchResult)
  res.redirect('search')
})

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
  } catch (error) {
    
  }
})

router.get('/profile', async (req, res) => {
  try {
    console.log('SESSION =====> ', req.session)
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      const listOfAddresses = await addressDB.find({ uId: req.session.user._id });
      //console.log(listOfAddresses);

      res.render('profile', { user, listOfAddresses })

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
  const { fName, lName, email, credit } = req.body;

  try {
    await User.findByIdAndUpdate(user._id,
      { fName, lName, email, credit }, { new: true });
    res.redirect('/profile');
  }

  catch (error) {
    console.log(error)
  }
})

router.get('/create', (req, res, next) => {
  res.render('create');
})

router.post('/create', async (req, res, next) => {
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
router.post('/addAddress', async (req, res, next) => {
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

router.post('/deleteAddress/:id', async (req, res, next) => {

  //console.log(req.params.id)
  try {
    await addressDB.findOneAndDelete({ _id: req.params.id })
    res.redirect('/profile');
  } catch (error) {
    console.log(error)
  }
})
router.get('/shopping-cart', (req, res) => {
  res.render('shopping-cart');
})

router.post('/shopping-cart', async (req, res) => {
  try {
    
  } catch (error) {
    
  }
})

router.get('/add-to-cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = req.session.user._id;
  await Cart.findOneAndUpdate({ user: userId }, { $push: { product: productId } });
  res.redirect('/');
})

module.exports = router;