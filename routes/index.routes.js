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

/*------------------ SEARCH BAR ------------------*/

router.get('/search', async (req, res, next) => {
  try {
    const products = await Product.find();
    const regionsArr = [];
    const datesArr = [];
    const typesArr = [];
    const designationsArr = [];

    products.forEach(product => {
      const region = product.region;
      const date = product.date;
      const type = product.type;
      const designation = product.designation;
      if (!regionsArr.includes(region)) {
        regionsArr.push(region);
      }
      if (!datesArr.includes(date)) {
        datesArr.push(date);
      }
      if (!typesArr.includes(type)) {
        typesArr.push(type);
      }
      if (!designationsArr.includes(designation)) {
        designationsArr.push(designation);
      }
    })
    
    regionsArr.sort();
    datesArr.sort();
    typesArr.sort();
    designationsArr.sort();

    res.render('search', { products, regionsArr, datesArr, typesArr, designationsArr })
  } catch (error) {
    console.log(error);
  }
})

router.post('/search', async (req, res, next) => {
  const { region, date, type, designation} = req.body;
  let searchResult;
  if (region !== '' && date !== '' && type !== '' && designation !== ''){
    searchResult = await Product.find({ region: region, date: date, type: type, designation: designation });
  } else if (region !== '' && date === '' && type === '' && designation === '') {
    searchResult = await Product.find({ region: region })
  } else if (region === '' && date !== '' && type === '' && designation === '') {
    searchResult = await Product.find({ date: date })
  } else if (region === '' && date === '' && type === '' && designation !== '') {
    searchResult = await Product.find({ designation: designation })
  } else if (region === '' && date === '' && type !== '' && designation === '') {
    searchResult = await Product.find({ type: type })
  } 
  res.render('search-result', {searchResult});
})

router.get('/search-result', async(req, res) => {
  console.log(req.body);
  res.render('search-result');
})

/*------------------ SEARCH BAR ------------------*/

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

/*------------------ CREATE PRODUCT ------------------*/
/*------ Should be accessible only for the Admin -----*/

router.get('/create', (req, res, next) => {
  res.render('create');
})

router.post('/create', async (req, res, next) => {
  try {
    const { name, region, designation, type, date, picture, price } = req.body;
    await Product.create({
      name: name,
      region: region,
      designation: designation,
      type: type,
      date: date,
      picture: picture,
      price: price
    })
    res.redirect('/create');
  } catch (error) {
    console.log(error)
  }
})

/*------------------ // CREATE PRODUCT ------------------*/

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
  let newCart = await Cart.findOneAndUpdate({ user: userId }, { $push: { product: productId } });
  res.redirect('/');
})

module.exports = router;