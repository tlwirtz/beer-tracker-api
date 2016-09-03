# beer-tracker-api
Backend API server for our beer tracker server.
Beer Tracker was created to track my personal beer inventory.

It will be wired up to a raspberry-pi server that communicates with re-purposes Amazon Dash Buttons. Each button represents one type of beer and each press will deduct the appropriate beer from inventory.

Inventory can also be administered via a mobile web application (still under development).
Users will be able to add and modify inventory, beers and devices.

# Resources
## Beer
### Object Schema
```
{
  id: mongooseID,
  name: beer-name,
  device: {
    macID: mac-address,
    name: name
  },
  transactions: [
    {
      id: uuid
      time: date.now(),
      type: transaction-type, //provided by caller
      qty: transaction-qty //provided by caller
    },
    {
      id: uuid
      time: date.now(),
      type: transaction-type,
      qty: transaction-qty
    }
  ]
}
```
### Routes -- TODO -- UPDATE WITH DEVICE ROUTES
`/api/beer` -- base route for all incoming requests  
`/api/beer/` -- POST -- Create a new beer  
`/api/beer/` -- GET -- Get all beers  
`/api/beer/:id` -- GET -- Get specified beer  
`/api/beer/:id` -- PUT -- Update specified beer  
`/api/beer/:id` -- DELETE -- Delete specified beer  
`/api/beer/:id/transaction` -- POST --  Create a new transaction for the specified beer  
`/api/beer/:id/transaction` -- GET --  Get all transactions for the specified beer  
`/api/beer/:id/transaction/:id` -- DELETE --  Delete specified transaction for the specified beer  
`/api/device/:mac-id/` -- POST -- Create a new transaction for the beer specified at that mac address  
