(function() {

  var AMAZON_LINK_REGEX = /((?:https?:)?(?:\/\/)?(?:www\.)?amazon\.[^\b\s"'<>()]+)/ig;
  var AMAZON_DOMAIN_EXTRACTOR_REGEX = /amazon\.([^\?\/]{2,})/i;
  var AMAZON_ASIN_EXTRACTOR_REGEX = /\/([A-Z0-9]{10})(?:[\?\/]|$)/i;

  Discourse.Dialect.addPreProcessor(function(text) {
    if (Discourse.SiteSettings.affiliate_enabled) {
      text = text.replace(AMAZON_LINK_REGEX, function(href) {
        if (AMAZON_DOMAIN_EXTRACTOR_REGEX.test(href)) {
          var domain = AMAZON_DOMAIN_EXTRACTOR_REGEX.exec(href)[1];
          if (AMAZON_ASIN_EXTRACTOR_REGEX.test(href)) {
            var asin = AMAZON_ASIN_EXTRACTOR_REGEX.exec(href)[1];
            href = "https://www.amazon." + domain + "/dp/" + asin;
            if (Discourse.SiteSettings.affiliate_amazon_tag.length > 0) {
              href += "?tag=" + Discourse.SiteSettings.affiliate_amazon_tag;
            }
          }
        }
        return href;
      });
    }
    return text;
  });

})();
