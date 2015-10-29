(function() {

  var AMAZON_DOMAIN_EXTRACTOR_REGEX = /amazon\.([^\?\/]{2,})/i;
  var AMAZON_ASIN_EXTRACTOR_REGEX = /\/([A-Z0-9]{10})(?:[\?\/]|$)/i;

  Discourse.Dialect.on("parseNode", function(event) {
    if (Discourse.SiteSettings.affiliate_enabled) {
      var node = event.node;
      if (node[0] === "a") {
        var href = node[1].href;
        if (AMAZON_DOMAIN_EXTRACTOR_REGEX.test(href)) {
          var domain = AMAZON_DOMAIN_EXTRACTOR_REGEX.exec(href)[1];
          if (AMAZON_ASIN_EXTRACTOR_REGEX.test(href)) {
            var asin = AMAZON_ASIN_EXTRACTOR_REGEX.exec(href)[1];
            href = "//www.amazon." + domain + "/dp/" + asin;
            if (Discourse.SiteSettings.affiliate_amazon_tag.length > 0) {
              href += "?tag=" + Discourse.SiteSettings.affiliate_amazon_tag;
            }
            node[1].href = href;
          }
        }
      }
    }
  });

})();
