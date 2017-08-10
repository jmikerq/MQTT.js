#! /usr/bin/env node

var mqtt = require('../')
var keypress = require('keypress')

keypress(process.stdin)
var clientCount = 2

console.log('start')

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name === 'b') {
    console.log('Add new bombing client' + clientCount)
    new bombingClient(clientCount)
    clientCount++
  }
  if (key && key.ctrl && key.name == 'c') {
    process.exit(1)
  }
})

process.stdin.setRawMode(true);
process.stdin.resume();

function bombingClient(id) {
  var sent = 0;
  var interval = 5000;
  var delayMillis = 0; //1 second
  // var id = id;
  var clientId = (id>9)? 'testrobot2-000'+id : 'testrobot2-0000'+id;
  console.log('Start new client ' + clientId);
  var client = mqtt.connect({
    port: 1883, 
    host: 'test-mqtt.sensetecnic.com', 
    clean: true, 
    keepalive: 0,
    username: 'testrobot2',
    clientId: clientId, //testrobot2-00001 
    password: '12345678' //12345678    
  });

  function count () {
    console.log(clientId + ": sent/s", sent / interval * 1000);
    sent = 0;
  }

  setInterval(count, interval);

  function publish () {
    setTimeout(function() {
      sent++;
      client.publish('users/testrobot2/loadtest', 'payload', publish);
    }, delayMillis);
  }

  client.on('connect', publish);

  client.on('error', function () {
    console.log(clientId +' reconnect!');
    client.stream.end();
  })
}
