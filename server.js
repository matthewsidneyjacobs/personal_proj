var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');

var middleware = require('./middleware.js')(db);

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
app.get('/foodItems', middleware.requireAuthentication, function(req,res) {
  var query = req.query;

  var where = {};

  if (query.hasOwnProperty('q')&&query.q.length>0) {
    where.description = {
      $like: '%'+query.q+'%'
    };
  }

  db.item.findAll({where: where}).then(function(foodItems) {
    res.json(foodItems);
  }, function(e) {
    res.status(500).send();
  })
  // var filteredfoodItems = foodItems;
  //
  // if (queryParams.hasOwnProperty('q') && queryParams.q.length>0) {
  //   filteredfoodItems = _.filter(filteredfoodItems, function(item) {
  //     return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
  //   })
  // }
  //
  // res.json(filteredfoodItems);
});


//GET /foodItems/:id
app.get('/foodItems/:id', middleware.requireAuthentication, function (req,res) {
  var foodItemId = parseInt(req.params.id, 10);

  db.item.findById(foodItemId).then(function(item) {
    if (!!item) {
      res.json(item.toJSON());
    } else {
      res.status(404).send();
    }
  }, function(e) {
    res.status(500).send();
  })
  // var matchedItem = _.findWhere(foodItems, {id: foodItemId})
  //
  // if (matchedItem) {
  //   res.json(matchedItem)
  // } else {
  //   res.status(404).send();
  // }
  //
  // res.send('asking for item with id of ' + req.params.id)
})



//POST add new fooditem /foodItems
app.post('/foodItems', middleware.requireAuthentication, function(req,res) {
  var body = _.pick(req.body, 'description', 'daysleftstillgood');

  db.item.create(body).then(function(item) {
    // res.status(200).json(item.toJSON());
    req.user.addItem(item).then(function() {
      return item.reload();
    }).then(function (item) {
      res.json(item.toJSON());
    });
  },function(e) {
    res.status(400).json(e)
  });
  // if (!_.isNumber(body.daysleftstillgood) || !_.isString(body.description) || body.description.trim().length === 0) {
  //   return res.status(400).send();
  // }
  // body.description = body.description.trim();
  // body.id = foodItemNextId++;
  // foodItems.push(body);
  //
  // res.json(body);
});

//DELETE /foodItems/:id
app.delete('/foodItems/:id',  middleware.requireAuthentication, function(req,res) {
  //_.without
  var foodItemId = parseInt(req.params.id, 10);

  db.item.destroy({
    where: {
      id: foodItemId
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'no item with that id'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send()
  });


  // var matchedItem = _.findWhere(foodItems, {id: foodItemId})
  // if (!matchedItem) {
  //   res.status(404).json({"error": "no item found with that id"});
  // } else {
  //   foodItems = _.without(foodItems, matchedItem);
  //   res.json(matchedItem);
  // }
  //
  // res.send('asking to delete item with id of ' + req.params.id)
})

//PUT /foodItems/:id
app.put('/foodItems/:id', middleware.requireAuthentication, function(req,res) {
  var foodItemId = parseInt(req.params.id, 10);

  var body = _.pick(req.body, 'description', 'daysleftstillgood');
  var attributes = {};


  if (body.hasOwnProperty('daysleftstillgood')) {
    attributes.daysleftstillgood = body.daysleftstillgood
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }

  db.item.findById(foodItemId).then(function(item) {
		if (item) {
			item.update(attributes).then(function(item) {
				res.json(item.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});

  // if(body.hasOwnProperty('daysleftstillgood') && _.isNumber(body.daysleftstillgood)) {
  //   validAttributes.daysleftstillgood = body.daysleftstillgood;
  // } else if (body.hasOwnProperty('daysleftstillgood')) {
  //   return res.status(400).send()
  // }
  //
  // if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
  //   validAttributes.description = body.description
  // } else if (body.hasOwnProperty('description')) {
  //   return res.status(400).send
  // }

  // _.extend(matchedItem, validAttributes);
  // res.json(matchedItem);
});

//MAKE USERS
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});


//POST /users/login
app.post('/users/login', function(req,res) {
  var body = _.pick(req.body, "email" , "password");

  db.user.authenticate(body).then(function(user) {
    var token = user.generateToken('authentication');

    if (token) {
      res.header('Auth', token).json(user.toPublicJSON());
    } else {
      res.status(401).send();
    }
  }, function(e) {
    res.status(401).send();
  })


});

db.sequelize.sync({force:true}).then(function() {
  app.listen(PORT, function() {
    console.log('I\'m listening on port: ', PORT)
  })
})
