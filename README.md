# Server using a JSON presentation layer protocol
## Usage

Install JSON Layer:
```
npm install json-layer
```

Start a server:
```
var jsonLayer = require('json-layer');

var server = new jsonLayer.JSONServer('0.0.0.0', 8080, {useCluster:true});

server.start(function(jsonSocket) {
    jsonSocket.on('json-data', function(err, data) {
        if(!err) {
            console.log(data);
            jsonSocket.send({'I have received the following data:': data});
        }
    });
});
```

Use a client:

```
const net = require('net');
const client = new jsonLayer.JSONLayeredSocket(net.connect({port: 8080}, () => {
  // 'connect' listener
  console.log('connected to server!');
  client.send({'array':[1,2,3,4,5,6]});
}));

client.on('json-data', (err, data) => {
  console.log(data);
//  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
