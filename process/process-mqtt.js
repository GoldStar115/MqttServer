//This is mqtt client for orderbook and websocket
var mqtt = require('mqtt');
var global = require('../utils/global')
var symdb = require('../symboldb/symboldb');
var Processor_Active = require('./process-active').ProcessorActive;
var mqttclient = mqtt.connect(global.mqttIPs.public, global.mqttcredential);
var cron = require('node-cron');
mqttclient.on('connect', function () {
    mqttclient.subscribe(global.symboltopic.rec);
    mqttclient.subscribe(`${global.rec_activedata_topic.general}#`);
});
mqttclient.on('error', function (err) {
    console.log('mqtt error', err);
});
mqttclient.on('offline', function () {
    console.log('mqtt offline');
});
mqttclient.on('close', function () {
    console.log('mqtt close');
});
mqttclient.on('message', function (topic, message) {
    try {
        if (topic.includes(global.symboltopic.rec)) {
            mqttBoradObj(global.symboltopic.trans, JSON.stringify(symdb.allsymbolnames()));
        }
        else if (topic.includes(global.rec_activedata_topic.general)) {            
            var exchange = topic.split('/')[3];
            var topic = `${global.trans_activedata_topic[exchange.toLowerCase()]}`;
            var res = new Processor_Active().broadActiveData(exchange);
            if (res.length)
                mqttBoradObj(topic, res);
        }
    } catch (error) {
        console.log(error.toString());
    }
});

function mqttBoradObj(topic, obj) {
    mqttclient.publish(topic.toLowerCase(), JSON.stringify(obj), global.mqttcredential);
}
