var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000
var bodyParser = require('body-parser');
var _ = require('underscore');

var middleware = require('./middleware.js');

// app.use(middleware.requireAuthentication);


var foodItems = [];
var foodItemNextId = 1;

//this only works if url is 3000/about.  if i go to 3000/#/about, thats the app view of about
// app.get('/about', middleware.requireAuthentication, function(req,res) {
//   console.log('is this working?');
//   res.send('about us');
// })



app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.send('foodproject root')
})

//GET   /foodItems   or  /foodItems?daysleftstillgood = 3
app.get('/foodItems', function(req,res) {
  var queryParams = req.query;
  var filteredfoodItems = foodItems;

  if (queryParams.hasOwnProperty('q') && queryParams.q.length>0) {
    filteredfoodItems = _.filter(filteredfoodItems, function(item) {
      return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    })
  }

  res.json(filteredfoodItems);
});


//GET /foodItems/:id
app.get('/foodItems/:id', function (req,res) {
  var foodItemId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(foodItems, {id: foodItemId})

  if (matchedItem) {
    res.json(matchedItem)
  } else {
    res.status(404).send();
  }

  res.send('asking for item with id of ' + req.params.id)
})



//POST add new fooditem /foodItems
app.post('/foodItems', function(req,res) {
  var body = _.pick(req.body, 'description', 'daysleftstillgood');

  if (!_.isNumber(body.daysleftstillgood) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  body.description = body.description.trim();
  body.id = foodItemNextId++;
  foodItems.push(body);

  res.json(body);
});

//DELETE /foodItems/:id
app.delete('/foodItems/:id', function(req,res) {
  //_.without
  var foodItemId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(foodItems, {id: foodItemId})

  if (!matchedItem) {
    res.status(404).json({"error": "no item found with that id"});
  } else {
    foodItems = _.without(foodItems, matchedItem);
    res.json(matchedItem);
  }

  res.send('asking to delete item with id of ' + req.params.id)
})

//PUT /foodItems/:id
app.put('/foodItems/:id', function(req,res) {
  var foodItemId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(foodItems, {id: foodItemId});
  var body = _.pick(req.body, 'description', 'daysleftstillgood');
  var validAttributes = {};

  if (!matchedItem) {
    return res.status(404).send();
  }


  if(body.hasOwnProperty('daysleftstillgood') && _.isNumber(body.daysleftstillgood)) {
    validAttributes.daysleftstillgood = body.daysleftstillgood;
  } else if (body.hasOwnProperty('daysleftstillgood')) {
    return res.status(400).send()
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send
  }

  _.extend(matchedItem, validAttributes);
  res.json(matchedItem);

});









app.listen(PORT, function() {
  console.log('I\'m listening on port: ', PORT)
})
