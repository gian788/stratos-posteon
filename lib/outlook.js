var phantom = require('phantom');
var path = require('path');

var viewportSize = {
  width: 800,
  height : 80000
};

exports.parse = function (html, callback) {
	phantom.create({}, function(ph){
      var page;
      try {
        ph.createPage(function(_page){
					function replaceImages (){
            page.injectJs(path.join(__dirname,'../node_modules/jquery/dist/jquery.js'), function () {
							page.evaluate(function() {
                $('img').replaceWith(function () {
                  var img = $(this).clone();
                  var outImg = $(this).clone();
                  outImg.attr('width', this.clientWidth);
                  outImg.attr('height', this.clientHeight);
                  outImg.css('height', '');
                  outImg.css('min-height', '');
                  outImg.css('max-height', '');
                  outImg.css('width', '');
                  outImg.css('min-width', '');
                  outImg.css('max-width', '');
                  var replaceString = '<!--[if mso]> ' +
                    outImg.prop('outerHTML') + ' <![endif]--> ' +
                    ' <!--[if !mso]><\!--> ' + img.prop('outerHTML') +
                    ' <!-- <![endif]--> ';
                  return replaceString;
                });
								return $('body')[0].outerHTML;
              }, function (parsed){
								callback(null, parsed);
							});
						});
					}
          page = _page;
          page.set('settings.localToRemoteUrlAccessEnabled', true);
          page.set('settings.loadImages', true);
          page.set('settings.webSecurityEnabled', false);
          page.set('viewportSize', viewportSize, function(){
            page.open('about:blank', function (err) {
              if (err) {
                console.error(err);
              }
              page.setContent(html);
              replaceImages();
            });
          });
         });
      } catch (e){
        try {
          if (page != null) {
            page.close();
          }
        } catch (e) {
          console.error(e);
        }
        return callback(e);
      }
   });
};
