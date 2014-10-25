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
          url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=aae634c2226a85c177bc77c747a29d45&text=danbo&extras=url_z&per_page=60&format=json&jsoncallback=?',
          source = Handlebars.compile($('#gallery-template').html());

      self.setJSONImage(url, source, $('#gallery'));

      $(document).on('click', '.mod-cloud span', function (e) {
        e.preventDefault();
        self.smoothScroll(this.hash);
      });

      return this;
    },

    setJSONImage: function (url, source, $elem) {
      $.getJSON(url, function(json) {
        $elem.html(source(json));
      });
    },

    smoothScroll: function(options) {
      var c = $.extend({
        speed : 650,
        easing : 'swing'
      }, options);

      $('html,body').animate({scrollTop: 0}, c.speed, c.easing);
    }
  };

})();

cssnitesap = new CSSNITESAP();
