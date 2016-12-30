'use strict';

const net = require('net');
const cluster = require('cluster');
const check = require('check-types');

const numCPUs = require('os').cpus().length;

var JSONLayeredSocket = require("./json-layered-socket");

class JSONServer {
    constructor(address, port, opts) {
        this.address = address;
        this.port = port;

        if(opts !== undefined) {
            this.useCluster = opts.useCluster === undefined?false:check.assert.boolean(opts.useCluster, 'The "use cluster"" parameter must be boolean');
        }
    }

    start(cb) {
        if(this.useCluster && cluster.isMaster) {
            for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });
        } else {
            var server = net.createServer(function(socket) {
                var jsonLayeredSocket = new JSONLayeredSocket(socket);

                cb(jsonLayeredSocket);
            });

            server.listen(this.port, this.address);
        }
    }
}

module.exports = JSONServer;