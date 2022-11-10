const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const addressDB = require('../models/addresses.model');
const SCart = require('../models/sCart.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/*------------------ // MAIN PAGE ------------------*/

router.get("/", async (req, res, next) => {
  try {
    let allProducts = await Product.find();
    let counter = 0;
    if (allProducts.length > 4)
    {
      let randomNumbers = [];
      while (randomNumbers.length < 4) {
        let number = Math.floor(Math.random() * (allProducts.length - 1) + 1);
        if (randomNumbers.indexOf(number) === -1) {
          randomNumbers.push(number);
        }
        counter +=1;
          if (counter > 20)
          {
            break;
          }
      }
      let randomProducts = [];
      randomNumbers.forEach(element => {
        randomProducts.push(allProducts[element])
      });
      allProducts = randomProducts
    }
    
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
let searchResult;
router.post('/search', async (req, res, next) => {
  const { region, date, type, designation} = req.body;
  //let searchResult;
  try {
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
  } catch (error) {
    console.log(error)
  }
})

router.get('/search-result', async(req, res) => {
  // console.log(req.body);
  res.render('search-result');
})

// add Products from searche Page to Shopping Card

router.post('/addToSchoppingCard/fromSearchResult/:id',isLoggedIn, async(req, res, next) => {
  const userID = "" + req.session.user._id;
  try {
    const findCard = await SCart.findOneAndUpdate({uId: userID, purchased: "false"}, {$push: {product: {pId: req.params.id, quantity: req.body.quantity}}})
    console.log("AAAAAAAAAAAAAAA", searchResult)
    res.render('search-result', {searchResult});
  } catch (error) {
    console.log(error)
  }
})

/*------------------ PROFILE ROUTES ------------------*/

router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    //console.log('SESSION =====> ', req.session)
    const user = await User.findById(req.session.user._id);
    const listOfAddresses = await addressDB.find({ uId: req.session.user._id });
    const allPurchases = await SCart.find({ uId: req.session.user._id, purchased: "true" });
    const allProducts = await Product.find();
    res.render('profile', { user, listOfAddresses, allPurchases, allProducts })
  }
  catch (error) {
    console.log(error);
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

router.get('/addAddress', (req, res, next) => {
  res.render('addAddress');
})

/*------------------ // CREATE ADDRESS ------------------*/

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

/*------------------ // DELETE ADDRESS ------------------*/

router.post('/deleteAddress/:id',async(req, res, next) => {
  
  try {
    await addressDB.findOneAndDelete({ _id: req.params.id })
    res.redirect('/profile');
  } catch (error) {
    console.log(error)
  }
})

/*------------------ // SHOPPING CARD ------------------*/

router.post('/addToSchoppingCard/:id',isLoggedIn, async(req, res, next) => {
  
  const userID = "" + req.session.user._id;
  try {
    const findCard = await SCart.findOneAndUpdate({uId: userID, purchased: "false"}, {$push: {product: {pId: req.params.id, quantity: req.body.quantity}}})
    res.redirect('/');
  } catch (error) {
    console.log(error)
  }
})

router.get('/ShoppingCard',isLoggedIn, async (req, res, next) => {
  try{
    const allProducts = await Product.find();
    const SCard = await SCart.find({uId: req.session.user._id, purchased: "false"});
    // create the total price youe have to pay
    const sCardProducts = SCard[0].product;
    let sumAll = 0;
    sCardProducts.forEach(element => {
      let id1 = "" + element.pId;
      allProducts.forEach(product =>{
        let id2 = "" + product._id;
        if(id1 === id2){
          sumAll += (product.price * element.quantity)
        }
      })
    });
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"}, {sum: sumAll});
    res.render('shoppingCard', {allProducts, sCardProducts, sumAll} );
  }
  catch (error) {
    console.log(error)
  }
})

// delete one product from your shopping card
router.post('/deleteFromShoppingCard/:id',async(req, res, next) => {
  try {
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"} ,{$pull: {product: {_id: req.params.id}}})
    res.redirect('/ShoppingCard');
  } catch (error) {
    console.log(error)
  }
})

/*------------------ // PURCHASE ROUTES ------------------*/

router.get('/purchase',isLoggedIn, async (req, res, next) => {
  try{
    const allProducts = await Product.find();
    const SCard = await SCart.find({uId: req.session.user._id, purchased: "false"});
    const sCardProducts = SCard[0].product;
    const listOfAddresses = await addressDB.find({uId: req.session.user._id});
    const user = await User.findById(req.session.user._id);
    // again create the total price - because you can change the amount here as well
    let sumAll = 0;
    sCardProducts.forEach(element => {
      let id1 = "" + element.pId;
      allProducts.forEach(product =>{
        let id2 = "" + product._id;
        if(id1 === id2){
          sumAll += (product.price * element.quantity)
        }
      })
    });
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"}, {sum: sumAll});

    res.render('purchase', {user, allProducts, sCardProducts, sumAll, listOfAddresses} );
  }
  catch (error) {
    console.log(error)
  }
})

router.post('/deleteFromPurchase/:id',async(req, res, next) => {
  try {
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"} ,{$pull: {product: {_id: req.params.id}}})
    res.redirect('/purchase');
  } catch (error) {
    console.log(error)
  }
})

// finish to buy - accept the purchase

router.post('/purchase/buy',async(req, res, next) => {
  try {
    // update users credit
    const SCard = await SCart.find({uId: req.session.user._id, purchased: "false"});
    const currentUser = await User.findOne({_id: req.session.user._id });
    const newCredit = currentUser.credit - SCard[0].sum;
    await User.findOneAndUpdate({_id: req.session.user._id}, {credit: newCredit});

    // update your shopping card - the choosen address and that you purchased your shopping card

    const listOfAddresses = await addressDB.find({ uId: req.session.user._id });
    let addAddressToPurchase = ""
    listOfAddresses.forEach(address => {
      let id = "" + address._id;
      if(id === req.body._id)
      {
        addAddressToPurchase += address.fName + " " + address.lName + ", " + address.aLine + ", " + address.zip + " " + address.city;
      }
    });
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"}, {address: addAddressToPurchase});
    await SCart.findOneAndUpdate({uId: req.session.user._id, purchased: "false"}, {purchased: true});
    
    // now we need a new shopping Card
    findSCard = await SCart.find({uId: req.session.user._id, purchased: "false"})
    if(findSCard.length < 1)
       {
        await SCart.create({
          uId: req.session.user._id
        }) 
       }
    res.redirect('/');
  } catch (error) {
    console.log(error)
  }
})

/*------------------ // ALL PRODUCTS ROUTES ------------------*/

router.get("/allProducts", async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    res.render("allProducts", {allProducts});
    
  } catch (error) {
    console.log(error)
  }
});

// add products from All Products Page to shopping card

router.post('/addToSchoppingCard/fromAllProducts/:id',isLoggedIn, async(req, res, next) => {
  const userID = "" + req.session.user._id;
  try {
    const findCard = await SCart.findOneAndUpdate({uId: userID, purchased: "false"}, {$push: {product: {pId: req.params.id, quantity: req.body.quantity}}})
    res.redirect('/allProducts');
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;