'use strict';

module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
  app.get('/ping', function(req, res) {
    res.send('pong');
  });

  // removing REST route from middlewares.json
  // "routes": {
  //   "loopback#rest": {
  //     "paths": [
  //       "${restApiRoot}"
  //     ]
  //   }
  // },
  app.use(app.settings.restApiRoot,
    app.loopback.rest(),
    (err, req, res, next) => {
      // error never reaches here...
      console.log('>>>>', err)
      next(err)
    })
};
