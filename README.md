# beer-tracker-api
Backend API server for our beer tracker server.
Beer Tracker was created to track my personal beer inventory.

It will be wired up to a raspberry-pi server that communicates with re-purposed Amazon Dash Buttons. Each button represents one type of beer and each press will deduct the appropriate beer from inventory.

Inventory can also be administered via a web application (still under development).

Users will be able to add and modify inventory, beers and devices.
All API responses are in JSON format.

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
### Routes

The production version of this API can be accessed at [here](https://beer-tracker-api.herokuapp.com/)
### `/api/beer/` -- GET
Returns all the beers in the database.

STATUS `200 - OK`
```
[
  {
    id: '939302dsf023098dsf9',
    name: 'Hoegaarden',
    device: {
      macID: '1M3F8H9M',
      name: 'Amazon Dash - Gatorade'
    },
    transactions: [
      {
        id: '92309d9023vjse90909cv9'
        time: 1473713427889
        type: 'adjust-up'
        qty: 33
      },
      {
        id: '209830843209n89380r92fn2'
        time: 1473713427899,
        type: 'adjust-down',
        qty: 1
      }
    ]
  },
  {
    id: '939302dsf023098dsf9',
    name: 'Kilt Lifter',
    device: null,
    transactions: [
      {
        id: 92309d9023vjse90909cv9
        time: 1473713427889
        type: 'adjust-up'
        qty: 3
      },
      {
        id: 209830843209n89380r92fn2
        time: 1473713427899,
        type: 'adjust-down',
        qty: 1
      }
    ]
  }
]
```
### `/api/beer/` -- POST
Creates a new beer.

POST body example:
```
{
  name: 'Rainier',
}
```

STATUS `200 - OK`
```
{
  id: 90380998v908ew09df8,
  name: 'Rainier',
  transactions: [],
  device: null
}
```

### `/api/beer/:id` -- GET
Get specified beer.

STATUS: `200 - OK`
```
{
  id: '939302dsf023098dsf9',
  name: 'Hoegaarden',
  device: {
    macID: '1M3F8H9M',
    name: 'Amazon Dash - Gatorade'
  },
  transactions: [
    {
      id: '92309d9023vjse90909cv9'
      time: 1473713427889
      type: 'adjust-up'
      qty: 33
    },
    {
      id: '209830843209n89380r92fn2'
      time: 1473713427899,
      type: 'adjust-down',
      qty: 1
    }
  ]
}
```


### `/api/beer/:id` -- PUT
Update specified beer. Simply pass in the updated properties.

For example:
```
  {
    id: '939302dsf023098dsf9',
    name: 'Hoegarrden',
    device: {
      macID: '1M3F8H9M',
      name: 'Amazon Dash - Gatorade'
    },
    transactions: [
      {
        id: '92309d9023vjse90909cv9'
        time: 1473713427889
        type: 'adjust-up'
        qty: 33
      },
      {
        id: '209830843209n89380r92fn2'
        time: 1473713427899,
        type: 'adjust-down',
        qty: 1
      }
    ]
  }
```

POST body example:
```
{
  name: 'Hoegaarden',
}
```

STATUS `200 - OK`
```
  {
    id: '939302dsf023098dsf9',
    name: 'Hoegaarden',
    device: {
      macID: '1M3F8H9M',
      name: 'Amazon Dash - Gatorade'
    },
    transactions: [
      {
        id: '92309d9023vjse90909cv9'
        time: 1473713427889
        type: 'adjust-up'
        qty: 33
      },
      {
        id: '209830843209n89380r92fn2'
        time: 1473713427899,
        type: 'adjust-down',
        qty: 1
      }
    ]
  }
```

### `/api/beer/:id` -- DELETE
Delete specified beer.

Returns STATUS `204 - No Data`

### `/api/beer/:id/transaction` -- POST
Create a new transaction for the specified beer  
The request body should be an object with two properties: `type` and `qty`.

`type` should either be `adjust-up` or `adjust-down`

POST body example:
```
{
  type: 'adjust-up',
  qty: 32
}
```

STATUS `200 - OK`
```
{
  id: '939302dsf023098dsf9',
  name: 'Hoegaarden',
  device: {
    macID: '1M3F8H9M',
    name: 'Amazon Dash - Gatorade'
  },
  transactions: [
    {
      id: '92309d9023vjse90909cv9'
      time: 1473713427889
      type: 'adjust-up'
      qty: 33
    },
    {
      id: '209830843209n89380r92fn2'
      time: 1473713427899,
      type: 'adjust-down',
      qty: 1
    },
    {
      id: '129038e90e2jf09jef90ef2',
      time: 1473713427899,
      type: 'adjust-up',
      qty: 32
    }
  ]
}
```
### `/api/beer/:id/transaction` -- GET
Get all transactions for the specified beer  

STATUS `200 - OK`
```
[
  {
    id: '92309d9023vjse90909cv9'
    time: 1473713427889
    type: 'adjust-up'
    qty: 33
  },
  {
    id: '209830843209n89380r92fn2'
    time: 1473713427899,
    type: 'adjust-down',
    qty: 1
  },
  {
    id: '129038e90e2jf09jef90ef2',
    time: 1473713427899,
    type: 'adjust-up',
    qty: 32
  }
]
```
### `/api/beer/:id/transaction/:id` -- DELETE
Delete specified transaction for the specified beer.

STATUS `204 - No Data`

## Device
### Object Schema
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash Button',
  macId: '1A2B3C4D5C6E',
  beerId: '939302dsf023098dsf9'
}
```
### `/api/device/:macAddr/register/:beerID` -- GET
Register a beer with the device.

STATUS `200 - OK`
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash Button',
  macId: '1A2B3C4D5C6E',
  beerId: '939302dsf023098dsf9'
}
```

### `/api/device/:macAddr/transaction` -- POST
Submit an inventory transaction for the beer registered with the device.

If no beer is registered to the device a `400` error will be returned. Intended to be used with the Dash Client.

Post body
```
{
  type: 'adjust-up',
  qty: 26
}
```

STATUS `200 - OK`
```
{
  id: '939302dsf023098dsf9',
  name: 'Hoegaarden',
  device: {
    macID: '1M3F8H9M',
    name: 'Amazon Dash - Gatorade'
  },
  transactions: [
    {
      id: '92309d9023vjse90909cv9'
      time: 1473713427889
      type: 'adjust-up'
      qty: 33
    },
    {
      id: '209830843209n89380r92fn2'
      time: 1473713427899,
      type: 'adjust-down',
      qty: 1
    },
    {
      id: '129038e90e2jf09jef90ef2',
      time: 1473713427899,
      type: 'adjust-up',
      qty: 32
    },
    {
      id: '129038e90e2jf023jef90ef2',
      time: 1473713427899,
      type: 'adjust-up',
      qty: 26
    }
  ]
}
```

### `/api/device` -- POST -- create a new device
Post body
```
{
    macID: '1M3F8H9M',
    name: 'Dash One'
}
```

STATUS `200 - OK`
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash One',
  macId: '1M3F8H9M',
}
```

### `/api/device/:id` -- PUT
Update a device
Update specified beer. Simply pass in the updated properties.

For example:
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash One',
  macId: '1M3F8H9M',
}
```

POST body example:
```
{
  name: 'Dash Two',
}
```

STATUS `200 - OK`
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash Tw0',
  macId: '1M3F8H9M',
}
```
### `/api/device/:id` -- GET
Get a device.

STATUS `200 -OK`
```
{
  id: '129038e90e2jf09jef90ef2',
  name: 'Dash One',
  macId: '1M3F8H9M',
}
```
### `/api/delete/:id` -- DELETE
Delete a device

STATUS `204 - No Data`

### `/api/device` -- GET
Get all devices

STATUS `200 -OK`
```
[
  {
    id: '129038e90e2jf09jef90ef2',
    name: 'Dash One',
    macId: '1M3F8H9M',
  },
  {
    id: '129038e90e2234f09jef90ef2',
    name: 'Dash Two',
    macId: '1M3F8J9X',
  }
]
```
