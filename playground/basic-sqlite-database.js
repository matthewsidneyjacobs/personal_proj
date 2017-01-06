var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname+'/basic-sqlite-database.sqlite'
});

//learn more about models maybe here we would set up all aspects of food table that i want?
var Item = sequelize.define('item', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1,250]
    }
  },
  daysleftstillgood: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isNumeric: true,
      min:1
    }
  }
})
sequelize.sync({
  // force:true
}).then(function() {
  console.log('everything is synced');

  Item.findById(3).then(function (item) {
    if (item) {
      console.log(item.toJSON());
    } else {
      console.log('item not found');
    }
  })

  // Item.create({
  //   description: 'apple',
  //   daysleftstillgood: 3
  // }).then(function (item) {
  //   return Item.create({
  //     description: "banana"
  //   })
  // }).then(function() {
  //   // return Item.findById(1)
  //   return Item.findAll({
  //     where: {
  //       description: {
  //         $like: '%pp%'
  //       }
  //     }
  //   });
  // }).then(function(items) {
  //   if (items) {
  //     items.forEach(function (item) {
  //       console.log(item.toJSON());
  //
  //     })
  //   }else {
  //     console.log('no item found');
  //   }
  // }).catch(function(e) {
  //   console.log(e);
  // });
})
