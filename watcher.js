var fs = require('fs');
var _ = require('lodash');

var config, gumtree, telegram;

function watch() {
  var result = getJsonFile(config.resultFile) || [];
  var offers = gumtree.getOffers(config.keywords);

  offers
    .then(diffSendMessageWith(result))
    .then(saveJsonFile(config.resultFile));
}

function diffSendMessageWith(result){
  return function (data) {
    var newSet = _.cloneDeep(data);
    var oldSet = result;

    var diffs = _.differenceWith(newSet, oldSet, compareOffer);
    _.forEach(diffs, sendMessageByOffer);

    return data;
  }
}

function saveJsonFile(filename) {
  return function(data) {
    fs.writeFile(filename, JSON.stringify(data, null, '\t'));
  }
}

function getJsonFile(filename) {
  var result;
  try {
    fs.accessSync(filename, fs.F_OK);
    result = JSON.parse(fs.readFileSync(filename));
  } catch (e) {
    result = false;
  }
  return result;
}

function compareOffer(a, b) {
  return a.link == b.link && a.name == b.name && a.price == b.price
}

function sendMessageByOffer(offer) {

    var message = [
      '<b>** New offer ' + config.keywords + ' alert **</b>',
      '\n=======================\n',
      '<b>' + offer.name + '</b>',
      '\n=======================\n\n',
      offer.desc,
      '\n\n-----------------------\n\n',
      '<strong>Area:</strong> ' + offer.area.replace(/\n/gi, '') + '\n',
      '<strong>Price:</strong> ' + offer.price + '\n',
      '<strong>Date:</strong> ' + offer.date + '\n',
      '\n',
      '<a href="http://www.gumtree.com.au' + offer.link + '">Go Shopping</a>',
    ''].join('');

    telegram.sendMessage(config.telegramId, message, 'HTML', function() {
      telegram.sendMessage(config.telegramId, offer.img);
    });
}

var watcher = {};
watcher.watch = watch;

module.exports = function(c, g, t) {
  config = c;
  gumtree = g;
  telegram = t;

  return watcher;
};
