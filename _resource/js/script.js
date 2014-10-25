'use strict';

var CSSNITESAP = {},
    cssnitesap;

CSSNITESAP = function () {
  this.init();
};

(function () {

  CSSNITESAP.prototype = {
    init: function () {
      var self = this,
          url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9ea117055f8b666dcdf497d6625aa5dd&text=danbo&extras=url_z&per_page=60&format=json&jsoncallback=?',
          source = Handlebars.compile($('#gallery-template').html());

      self.setJSONImage(url, source, $('#gallery'));

      return this;
    },

    setJSONImage: function (url, source, $elem) {
      $.getJSON(url, function(json) {
        $elem.html(source(json));
      });
    }
  };

})();

cssnitesap = new CSSNITESAP();
