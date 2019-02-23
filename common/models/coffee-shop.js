'use strict';

module.exports = function(CoffeeShop) {
  // console.log(JSON.stringify(Object.keys(CoffeeShop)))

  CoffeeShop.status = function(cb) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const OPEN_HOUR = 6;
    const CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    let response;
    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'We are open for business.';
    } else {
      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
    }
    cb(null, response);
  };
  CoffeeShop.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        arg: 'status',
        type: 'string',
      },
    }
  );

  CoffeeShop.observe('before save', async function(ctx) {
    const {isNewInstance, instance} = ctx
    // add default values
    if (!instance.updatedAt) {
      instance.updatedAt = new Date()
    }
    return
  });

  // add connector hooks
  CoffeeShop.getApp((e, app) => {
    const {connector} = app.dataSources.db

    // add optimistic locking...
    connector.observe('before execute', function(ctx, next) {
      const {model, req, end} = ctx
      const {params, command} = req

      if (model === 'CoffeeShop' && command === 'update') {
        const [where, data, ...other] = params
        const {updatedAt} = data
        where.updatedAt = updatedAt // uses updatedAt for optimistic locking
        data.updatedAt = new Date() // try to update timestamp
        ctx.req.params = [where, data, ...other]
      }

      next()
    })

    // catch error...
    connector.observe('after execute', function(ctx, next) {
      const {model, req, res, end} = ctx
      const {err} = res || {}

      // change error
      if (model === 'CoffeeShop' && err &&
        /^E11000 duplicate key error collection/.test(err.message)
      ) {
        err.status = 400
        err.message = 'duplicate key error'
        err.name = 'Error'
        delete err.code
        ctx.end(err, ctx, {});
      } else {
        next()
      }
    })
  })
};
