Order Anything

There are many use cases when people need to get something urgently, without wanting to do things themselves - like getting vegetables from the local market to forgetting your laptop charger at home. Starbucks doesn’t deliver, but wouldn't it be nice if someone could grab your fav drink from there!

The application that we propose to build solves the very same problem. It lets customers sign up using their phone no, and order almost anything (From our catalogue), the order is assigned to a delivery person by admin, where he can see order details, and delivery person can update its status.

Our catalogue would consist of thousands of items mapped to an array of addresses (Places where those items are available). Every item must first have a category. For Eg -

Chips -   Category Name - Food and Beverages,
  Addresses:
  [ 
   Loc 1 (24x7 Sector 54, Gurgaon, Lat - 12.21, Long - 28.72),
   Loc 2 (Big Bazaar, Sector 25, Gurgaon, Lat - 12.23, Long - 28.79)
  ]

Disprin -   Category Name - Pharmacy,
  Addresses:
  [ 
   Loc 1 (Apollo Medicine, Sector 63, Gurgaon, Lat - 12.25, Long - 28.52),
   Loc 2 (Apollo Medicine, Sector 22, Gurgaon, Lat - 12.20, Long - 28.29)
  ]

There are no initial prices for items, they 'll be added later. Just category and locations where they are available.

User Types -
Customer
Delivery Person
Admin

Login -
With Phone No/password which returns Auth token (to authenticate future APIs)


Order -
Array of Items (with quantity)
Delivery Person ID
Order Stages (Task Created, Reached Store, Items Picked, Enroute, Delivered and Canceled)
Customer ID
Pickup Locations (1 location is chosen randomly for each item in the order from the catalogue, For Eg - Loc 1 for Chips and Loc 2 for Pharmacy)

You need to create the Database Structure and APIs to do the following -
Signup/Login for all users [Phone No/Password]
Creating order from customer [Add to cart from available items and specify quantity, then place order]


[For each item in the order, system takes 1 random location from the catalogue/database and creates an array of pickup points for every order]


Admin can see orders (with status filter) and assign delivery person [View all delivery persons and orders, then assign order to delivery person ]
Driver can update order Status [View all available statuses and update it for any order id]

