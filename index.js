/**
 * sample client implementation
 */

const request = require('superagent')
const uri = 'http://localhost:3000/api'
const doFail = process.argv.includes('--fail')

const getShops = () =>
  request.get(`${uri}/CoffeeShops`).type('json')
    .then(({body}) => {
      console.log(body)
      return body
    })

const putShop = (shop) =>
  request.put(`${uri}/CoffeeShops`).type('json')
    .send(shop)
    .then(({body}) => {
      console.log(body)
      return body
    })

Promise.resolve()
  .then(() => getShops())
  .then(shops => {
    const shop = shops[1]
    shop.name += '.'
    if (doFail) shop.updatedAt = new Date('2019-01-08T21:31:26.448Z') // optimistic lock shall throw
    return putShop(shop)
  })
  .catch(console.error)
