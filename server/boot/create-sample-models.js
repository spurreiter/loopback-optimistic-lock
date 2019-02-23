'use strict'

module.exports = function(app) {
  const {CoffeeShop} = app.models

  function create() {
    CoffeeShop.create([{
      name: 'Bel Cafe',
      city: 'Vancouver',
    }, {
      name: 'Three Bees Coffee House',
      city: 'San Mateo',
    }, {
      name: 'Caffe Artigiano',
      city: 'Vancouver',
    }], function(err, coffeeShops) {
      if (err) throw err;
      console.log('Models created: \n', coffeeShops);
    });
  }
  CoffeeShop.find({where: {name: 'Bel Cafe'}}, (err, data) => {
    if (err || !data || !data.length) {
      create()
    }
  })
};
