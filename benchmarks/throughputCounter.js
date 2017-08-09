#! /usr/bin/env node

var mqtt = require('../')

var client = mqtt.connect({ 
  port: 1883, 
  host: 'test-mqtt.sensetecnic.com', 
  clean: true, 
  encoding: 'binary', 
  keepalive: 0,
  username: 'testrobot2',
  clientId: 'testrobot2-00001', 
  password: '12345678' //12345678
})
var counter = 0
var max = 0
var interval = 5000
var getAvg = []

var averageRange = 10

function count () {
  var sum = 0;
  var avg = 0
  var countDuringInterval = counter / interval * 1000
  getAvg.unshift(countDuringInterval);
  if(getAvg.length > averageRange) {getAvg.pop()}
  for(i=0;i<getAvg.length;i++) {
    sum += getAvg[i]
  }
  avg = sum / getAvg.length;

  if (countDuringInterval > max) { max = countDuringInterval}
  console.log('max: ' + max.toFixed(2) + ', average: ' + avg.toFixed(2) + ', received/s: ' + countDuringInterval.toFixed(2) )
  counter = 0
}

setInterval(count, interval)

client.on('connect', function () {
  count()
  this.subscribe('users/testrobot2/loadtest')
  this.on('message', function () {
    counter++
  })
})

client.on('error', function () {
  console.log("error!")
})
