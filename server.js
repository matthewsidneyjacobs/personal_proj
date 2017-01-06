var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000


var middleware = require('./middleware.js');

// app.use(middleware.requireAuthentication);


var foodItems = [{
  id: 1,
  description: "apples",
  daysleftstillgood: 3
},{
  id: 2,
  description: "lettuce",
  daysleftstillgood: 2
},{
  id:3,
  description: "yams",
  daysleftstillgood: 7
}];

//this only works if url is 3000/about.  if i go to 3000/#/about, thats the app view of about
// app.get('/about', middleware.requireAuthentication, function(req,res) {
//   console.log('is this working?');
//   res.send('about us');
// })




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
  var matchedItem;
  foodItems.forEach(function(item) {
    if (foodItemId === item.id) {
      matchedItem = item;
    }
  });

  if (matchedItem) {
    res.json(matchedItem)
  } else {
    res.status(404).send();
  }

  res.send('asking for item with id of ' + req.params.id)
})


















app.listen(PORT, function() {
  console.log('I\'m listening on port: ', PORT)
})
