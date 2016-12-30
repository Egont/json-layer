'use strict';

const EventEmitter = require('events');
const readline = require('readline');

class JSONLayeredSocket extends EventEmitter {
    constructor(socket) {
        super(); // http://stackoverflow.com/questions/32516204/uncaught-referenceerror-this-is-not-defined-in-class-constructor
        this.socket = socket;
        this.rl = readline.createInterface(socket, socket);

        this.rl.on('line', this.onLine.bind(this));

        this.rl.on('close', this.onReadLineClose.bind(this));

        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('data', this.onData.bind(this));
        this.socket.on('drain', this.onDrain.bind(this));
        this.socket.on('end', this.onEnd.bind(this));
        this.socket.on('error', this.onError.bind(this));
        this.socket.on('lookup', this.onLookup.bind(this));

        this.address = this.socket.address;
        this.bufferSize = this.socket.bufferSize;
        this.bytesRead = this.socket.bytesRead;
        this.bytesWritten = this.socket.bytesWritten;
        this.connect = this.socket.connect;
        this.connecting = this.socket.connecting;
        this.destroy = this.socket.destroy;
        this.destroyed = this.socket.destroyed;
        this.end = this.socket.end;
        this.localAddress = this.socket.localAddress;
        this.localPort = this.socket.localPort;
        this.pause = this.socket.pause;
        this.ref = this.socket.ref;
        this.remoteAddress = this.socket.remoteAddress;
        this.remoteFamily = this.socket.remoteFamily;
        this.remotePort = this.socket.remotePort;
        this.resume = this.socket.resume;
        this.setEncoding = this.socket.setEncoding;
        this.setKeepAlive = this.socket.setKeepAlive;
        this.setNoDelay = this.socket.setNoDelay;
        this.setTimeout = this.socket.setTimeout;
        this.unref = this.socket.unref;
        this.write = this.socket.write;
    }

    send(object) {
        // We don't trap exceptions in the send and let them propagate
        var json = JSON.stringify(object);
        this.socket.write(json + '\n');
    }

    onLine(line) {
      try {
        var object = JSON.parse(line);
        this.emit('json-data', null, object);
      } catch(e) {
        console.error(e);
        this.emit('json-data', e, null);
      }

    }

    onClose(had_error) {
        //this.emit('close', had_error);
    }

    onReadLineClose(had_error) {
        this.emit('close', had_error);
    }

    onConnect() {
        this.emit('connect');
    }

    onData(data) {
        // Nothing here, the data is handled by the readline line even
    }

    onDrain() {
        this.emit('drain');
    }

    onEnd() {
        this.emit('end');
    }

    onError(err) {
        this.emit('error', err);
    }

    onLookup(err, address, family, host) {
        this.emit('lookup', err, address, family, host);
    }
}

module.exports = JSONLayeredSocket;