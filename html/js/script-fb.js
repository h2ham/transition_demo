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
          url = 'https://graph.facebook.com/693499280723474/photos/limit=20?access_token=CAACEdEose0cBAFB90MOt0ek7ZAeaiBNAsVT0GdURGxW9brm7T2uiKN3d6uGoJotEhhgxpWopNhw2wXcQkkTwfKwTPOCSPEZCHPC6brURujluZCZAzJDBkYvKB276RJCNWXbnWj7v60Pmka3zXFpJIIIzme26PBkaQdaK4x2G8urSZBPusvasOF4sUgwERB3fKv95LXJPcaMszEZCkklr1a',
          source = Handlebars.compile($('#gallery-template').html());

      self.setJSONImage(url, source, $('#gallery'));

      $(document).on('click', '.mod-cloud span', function (e) {
        e.preventDefault();
        self.smoothScroll(this.hash);
      });

      return this;
    },

    setJSONImage: function (url, source, $elem) {
      $.ajax({
        type: 'get',
        url: url,
        cache: false,
        dataType: 'jsonp',
        success: function(json){
          console.log(json);
          $elem.html(source(json));
        }
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
