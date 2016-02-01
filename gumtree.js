var request = require('request-promise');
var cheerio = require('cheerio');

var locationId = null;

function getOffers(keywords) {
  return request('http://www.gumtree.com.au/s-search.html?keywords='+keywords+'&locationId='+locationId)
    .then(function(res) {
      $ = cheerio.load(res);
      var area = $("#srchrslt-adtable > li[itemprop='offers']");
      var offers = [];
      area.each(function() {
        var offer = $(this);
        
        offers.push({
          img: offer.find('.rs-img img').attr('src') ? offer.find('.rs-img img').attr('src').trim() : '',
          link: offer.find('.rs-ad-title a').attr('href') ? offer.find('.rs-ad-title a').attr('href').trim() : '',
          name: offer.find('.rs-ad-title').text().trim(),
          desc: offer.find('.rs-ad-description').text().trim(),
          area: offer.find('.rs-ad-location').text().replace(/  /gi, '').trim(),
          date: offer.find('.rs-ad-date').text().trim(),
          price: offer.find('[itemprop="price"]').text().trim()
        });
      });
      return offers;
    });
}

var gumtree = {};
gumtree.getOffers = getOffers;

module.exports = function(location) {
  locationId = location || '3001317';
  return gumtree;
};
