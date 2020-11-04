node-red-contrib-rf-decode
====================

A <a href="https://nodered.org" target="_new">Node-RED</a> node that decodes RF data packets received via a serial node from a RFM2Pi or RFM69Pi board (as used by the <a href="https://openenergymonitor.org" target="_new">openenergymonitor</a> project (emoncms).

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-rf-decode

Usage
-----


### Inputs

The input into the node is normally received via the serial port `/dev/ttyAMA0` at a baud rate of 38400, and introduced into node-RED using a serial in node.

The format takes the form of byte packets;  
`OK 23 22 1 0 0 0 0 237 94 188 4 (-61)`  
although it may be a different length, depending upon the transmitting device.

The resultant UTF8 ascii string from the serial in node is then decoded by the `rf-decode` node.

### Outputs

The output msg includes;
 - ack: "OK" (acknowledgement of msg integrity
 - node: 23 (The originating node ID of the sending device)
 - rssi: -61 (The RSSI of the sending device)
 - time: 1547147593051 (Epoch timestamp of time received by the `rf-decode` node)
 - An array of the decoded sensor data, which can then be easily parsed.

### Example Flow

```
[{"id":"d237620a.0c054","type":"function","z":"c53060.842a0fa","name":"emonTH 23","func":"// Change this to the node number required\nif(msg.node == 23) {\n  msg.temp = (msg[0])/10;\n  msg.exttemp = (msg[1])/10;\n  msg.hum = (msg[2])/10;\n  msg.batt = (msg[3])/10;\n  msg.pulse = msg[4];\nreturn msg;    \n} else {\n    return null;\n    }","outputs":1,"noerr":0,"x":500,"y":920,"wires":[["d3aafc26.df883"]]},{"id":"d3aafc26.df883","type":"debug","z":"c53060.842a0fa","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":660,"y":920,"wires":[]},{"id":"fa74f41f.09ed78","type":"inject","z":"c53060.842a0fa","name":"Example data","topic":"","payload":"OK 23 22 1 0 0 0 0 237 94 188 4 (-61)","payloadType":"str","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":161,"y":920,"wires":[["655a22f5.34ba5c"]]},{"id":"ce6fb45d.8c2da8","type":"function","z":"c53060.842a0fa","name":"Diverter 10","func":"if(msg.node == 10) {\nmsg.grid = msg[0];\nmsg.solar = msg[1];\nmsg.divert = msg[2];\nmsg.volts = (msg[3])/1e2;\nmsg.temp = (msg[4])/1e2;\nreturn msg;    \n} else {\nreturn null;\n}","outputs":1,"noerr":0,"x":500,"y":960,"wires":[["d361ebb4.106268"]]},{"id":"d361ebb4.106268","type":"debug","z":"c53060.842a0fa","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":660,"y":960,"wires":[]},{"id":"655a22f5.34ba5c","type":"rf-decode","z":"c53060.842a0fa","name":"","x":334,"y":940,"wires":[["d237620a.0c054","ce6fb45d.8c2da8"]]},{"id":"305fcb31.dc1024","type":"serial in","z":"c53060.842a0fa","name":"Serial in","serial":"37141735.229d68","x":171,"y":960,"wires":[["655a22f5.34ba5c"]]},{"id":"37141735.229d68","type":"serial-port","z":"","serialport":"/dev/ttyAMA0","serialbaud":"38400","databits":"8","parity":"none","stopbits":"1","newline":"\\n","bin":"false","out":"char","addchar":false,"responsetimeout":"10000"}]
```
