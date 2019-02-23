# loopback-optimistic-lock

This is a small test project which adds optimistic locking to loopback models.
The attribute `updatedAt` is used to search for locked documents.

## test

1. start your mongoDb

2. start the server

    node server/server.js

3. An update with correct `updatedAt` timestamp

    node index.js

4. An update with outdated timestamp

    node index.js --fail

Pls. check `common/models/coffee-shop.js` for implementation details.

This project currently requires a custom fork of [loopback-datasource-juggler](https://github.com/spurreiter/loopback-datasource-juggler).

## optimistic locking at the database

Plain update with mongoDb, to give you an idea...

create document

```
db.getCollection('test').insertOne({
  name: "test", version: 1.0, updatedAt: new Date()
})
```

find document

```
var _id = ObjectId("5c34f76724b9aef1f8f2aaf5")
db.getCollection('test').find({ _id })
```

update document

```
var _id = ObjectId("5c34f76724b9aef1f8f2aaf5")
var updatedAt = ISODate("2019-01-08T18:41:15.826Z")
db.getCollection('test').update(
  { _id, updatedAt }
  ,{ $set: { name: "test2", updatedAt: new Date() }
    ,$inc: { version: 1 }
  }
)
db.getCollection('test').find({ _id })
```

## credits

This test project builds on [loopback-getting-started][].

## license

- Unknown: Code from [loopback-getting-started][].
- [Unlicense][]: For all changes compared to [loopback-getting-started][].

[Unlicense]: https://unlicense.org
[loopback-getting-started]: https://github.com/strongloop/loopback-getting-started
