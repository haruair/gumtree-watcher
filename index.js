var gumtree = require('./gumtree');
var telegram = require('./telegram');
var watcher = require('./watcher');

try {
  var config = require('./config.json');
} catch (e) {
  console.log("create `config.json` first");
  process.exit(1);
}

var g = gumtree(config.locationId);
var t = telegram(config.telegramKey);

var w = watcher(config, g, t);
w.watch();
