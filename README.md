# @horwood/socket-authenticator

This is a Node.js library that provides implementations for 
[@horwood/socket-server](https://github.com/lnhorwood/socket-server)'s 
[SocketAuthenticator](https://github.com/lnhorwood/socket-server/blob/master/src/model/socket-authenticator.ts) class.
Currently 
[MongoSocketAuthenticator](https://github.com/lnhorwood/socket-authenticator/blob/master/src/mongo/mongo-socket-authenticator.ts)
is the only implementation available and, as the name suggests, uses a MongoDB instance to handle authentication.

## Getting Started
It can be installed through the NPM registry by using the following command:
```bash
$ npm install @horwood/socket-authenticator
```
To make best use of it, it is also recommended to install 
[@horwood/socket-server](https://github.com/lnhorwood/socket-server).

### Usage
It is fairly simple to make use of. All it requires is for 
[MongoSocketAuthenticator](https://github.com/lnhorwood/socket-authenticator/blob/master/src/mongo/mongo-socket-authenticator.ts)
to be passed to 
[SocketServer](https://github.com/lnhorwood/socket-server/blob/master/src/model/socket-server.ts)'s secure function. 
Once this is done, the server will delegate the handling of authentication events to your authenticator. It's also
important to note that in order for 
[MongoSocketAuthenticator](https://github.com/lnhorwood/socket-authenticator/blob/master/src/mongo/mongo-socket-authenticator.ts)
to work, the application must have an active connection to MongoDB.
```js
import { SocketServer } from '@horwood/socket-server';
import { MongoSocketAuthenticator } from '@horwood/socket-authenticator';
import { connect } from 'mongoose';

connect('mongodb://localhost/database_name').then(() => {
  new SocketServer().secure(new MongoSocketAuthenticator()).on('connection').subscribe(socket => {
    // handle socket
  });
});
```
