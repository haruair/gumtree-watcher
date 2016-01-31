var request = require('request-promise');

var apiKey = null;

function sendMessage(userId, text, parseMode, callback) {
  parseMode = parseMode || '';
  return request
    .post('https://api.telegram.org/'+apiKey+'/sendMessage')
    .form({chat_id: userId, text: text, parse_mode: parseMode})
    .then(function(){
      if(callback) callback.apply(this, arguments);
    });
}

var telegram = {};
telegram.sendMessage = sendMessage;

module.exports = function(key) {
  apiKey = key;
  return telegram;
};
