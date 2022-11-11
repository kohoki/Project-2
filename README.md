Project Name: OnlineShop

Description:
Simple e-shop webapp with user authentication, adding products to your shopping cart and see your purchases history.

User Stories:
• 404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
• 500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
• Homepage - As a user I want to access the homepage, see a preview of the products i can buy and access differents pages thanks to the navigation bar.
• Sign up - As a user I want to sign up on the webpage so that I can start adding products to a shopping cart
• Login - As a user I want to log in on the webpage so that I can get back to my account.
• Profile page - As a user I want to be able to check my informations and update them, especially my address and my wallet. I also want to record all my previous orders.
• Product list - As a user I want to select products, see some details and add it to a shopping cart.
• Searchbar - As a user I want to filter all the products to find faster what i'm looking for.
• Shopping cart - As a user I want to be able to acces my shopping cart once I put some products in it.
• Purchase - As a user I want to be able to select one of my shipping adresses if i have multiple ones and validate my order if I have enought money in my wallet.
• Logout - Log out from the webpage so that I can make sure no one will access my account

--------------------------------------------------------------------------------------------------------------------

Routes (back-end)

GET /
render index.ejs

GET /auth/signup
redirect '/login'

GET /auth/login
redirect '/login' if no user with that username or incorrect password
username
password
redirect to '/profile'

GET /auth/logout
destroy session

GET /profile
body{
    user
    listOfAddresses
    allPurchases
    allProducts
}
render profile.ejs

POST /profile
body{
    fName, lName, email, credits
}
update User informations
redirect to '/profile'

GET /addAddress
render addAddress.ejs

POST /addAddress
body{
    uId, fName, lName, aLine, city, zip, country
}
redirect to '/profile'

POST /deleteAddress/:id
redirect to '/profile'

GET /allProducts
body{
    product name, region, date, designation, type, price
}
render allProducts.ejs

POST /addToShoppingCard/:id
body{
    req.sessions.user._id
}

GET /search
get region, date, designation, type
render search.ejs

POST /search
find products
render search-results.ejs

GET /search-results
render search-results.ejs

POST /addToSchoppingCart/fromSearchResult/:id
redirect to '/'

GET /shoppingCart
find Product
find SCart {req.session.user._id} and update
render shoppingCard.ejs

POST /deleteFromShoppingCard/:id
redirect to '/shoppingCard'

GET /purchase
body{
    user, allProducts, sCardProducts, sumAll, listOfAddresses
}
render purchase.ejs

POST /deleteFromPurchase/:id
redirect to '/purchase'

POST /purchase/buy
redirect to '/'

----------------------------------------------------------
----------------------------------------------------------

Models

User new Schema {username, email, password, fName, lName, credit, timestamps}
Product new Schema{name, region, designation, type, date, picture, price, timestamps}
Shopping Cart new Schema{userId, product[], purchase(default:false), sum, address, timestamps}
Address new Schema{userId, fName, lName, aLine, city, zip, country, timestamps}