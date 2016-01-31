var osc = require("osc"),
    express = require("express"),
    WebSocket = require("ws");

// serial
var COM_PORT = 'COM5';
var BAUD_RATE = 115200;

//OSC
var OSC_PORT = 57121;
var oscPorts = [];

//Web Sockets
var WS_PORT = 8081;

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

// Bind to a UDP socket to listen for incoming OSC events.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: OSC_PORT
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log("To start the demo, go to http://localhost:8081 in your web browser.");
});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
var app = express(),
    server = app.listen(WS_PORT),
    wss = new WebSocket.Server({
        server: server
    });

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");

    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    oscPorts.push(socketPort);

    console.log('new oscPort');

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });

    console.log('new relay');
});

var com = require("serialport");
var serialPort = new com.SerialPort(COM_PORT, {
    baudrate: BAUD_RATE,
    parser: com.parsers.readline('\r\n')
});

function mapVal(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function constrain(amt, low, high) {
    return (amt < low) ? low : ((amt > high) ? high : amt);
}

serialPort.on("open", function () {
    console.log('com port open');

    serialPort.on('data', function(data) {
        // data:
        // I0,1023,1023,1023,570,1023,1023,1023,1023,1023,1023,1023,569,1023,1023,1023,1023

        var d = data.split(',');
        if(d[0].substr(1) == '0') {
            var normalizedVal = constrain(mapVal(d[12], 375, 885, 0, 1), 0, 1);
            var n = Math.pow(normalizedVal, 0.55);

            oscPorts.forEach((oscPort, i) => {
                try{
                    oscPort.send({
                        address: "/stepper",
                        args: n
                    })
                }
                catch (err) {
                    oscPorts.splice(i);
                }
            });
        }

    });

    //serialPort.write("ls\n", function(err, results) {
    //    console.log('err ' + err);
    //    console.log('results ' + results);
    //});
});