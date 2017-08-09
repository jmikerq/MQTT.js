#! /usr/bin/env node

var mqtt = require('../')

console.log('testrobot2-'+process.argv[2]);

var client = mqtt.connect({ 
  port: 1883, 
  host: 'test-mqtt.sensetecnic.com', 
  clean: true, 
  keepalive: 0,
  username: 'testrobot2',
  clientId: 'testrobot2-'+process.argv[2], //testrobot2-00001 
  password: '12345678' //12345678
 })

var sent = 0
var interval = 5000
var delayMillis = 0; //1 second



function count () {
  console.log('sent/s', sent / interval * 1000)
  sent = 0
}

setInterval(count, interval)

function publish () {
  setTimeout(function() {
    sent++
    client.publish('users/testrobot2/loadtest', 'payload', publish)
  }, delayMillis);
}

client.on('connect', publish)

client.on('error', function () {
  console.log('reconnect!')
  client.stream.end()
})
