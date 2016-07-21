import { registerOption } from 'pretty-text/pretty-text';

const AMAZON_LINK_REGEX = /((?:https?:)?(?:\/\/)?(?:www\.)?amazon\.[^\b\s"'<>()]+)/ig;
const AMAZON_DOMAIN_EXTRACTOR_REGEX = /amazon\.([^\?\/]{2,})/i;
const AMAZON_ASIN_EXTRACTOR_REGEX = /\/([A-Z0-9]{10})(?:[\?\/%]|$)/i;

registerOption((siteSettings, opts) => {
  opts.features["affiliate"] = siteSettings.affiliate_enabled;
});

export function setup(helper) {
  helper.addPreProcessor(text => {
    console.log('do it');
    return text.replace(AMAZON_LINK_REGEX, href => {
      if (AMAZON_DOMAIN_EXTRACTOR_REGEX.test(href)) {
        const domain = AMAZON_DOMAIN_EXTRACTOR_REGEX.exec(href)[1];
        if (AMAZON_ASIN_EXTRACTOR_REGEX.test(href)) {
          const asin = AMAZON_ASIN_EXTRACTOR_REGEX.exec(href)[1];
          href = "https://www.amazon." + domain + "/dp/" + asin;
          if (Discourse.SiteSettings.affiliate_amazon_tag.length > 0) {
            href += "?tag=" + Discourse.SiteSettings.affiliate_amazon_tag;
          }
        }
      }
      return href;
    });
  });
}
