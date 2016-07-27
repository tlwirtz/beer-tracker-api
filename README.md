# beer-tracker-api
Backend API server for our beer tracker server

# Resources
## Beer
### Object Schema
```
{
  id: beer-id (uuid),
  name: beer-name,
  device: {
    macID: mac-address,
    name: name
  },
  transactions: [
    {
      id: uuid
      time: date.now(),
      type: transaction-type,
      qty: transaction-qty
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
### Routes
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
