module.exports = function(RED) {
    function RFDecodeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) { if (msg.payload.startsWith("OK")) {
  var x = msg.payload.trim().split(" ");
  msg.ack = x.shift();
  msg.node = Number(x.shift());
  msg.rssi = parseInt(x.pop().slice(1,-1));
  msg.time = Math.round((new Date()).getTime());
  for (var i=0; i < x.length; i++) {
      msg[i/2] = parseInt(x[i]) + parseInt(x[i+1]) * 256;
      if (msg[i/2] > 32768) { msg[i/2] = msg[i/2] - 65536; }
      i++;
  }
 node.send(msg);
  }
 });
}
    RED.nodes.registerType("rf-decode",RFDecodeNode);
}
