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

//GET /foodItems

app.get('/foodItems', function(req,res) {
  res.json(foodItems);
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














app.listen(PORT, function() {
  console.log('I\'m listening on port: ', PORT)
})
