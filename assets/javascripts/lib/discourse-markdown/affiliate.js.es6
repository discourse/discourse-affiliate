import { registerOption } from 'pretty-text/pretty-text';

const AMAZON_LINK_REGEX = /((?:https?:)?(?:\/\/)?(?:www\.)?(?:smile\.)?amazon\.[^\b\s"'<>()]+)/ig;
const AMAZON_DOMAIN_EXTRACTOR_REGEX = /amazon\.([^\?\/]{2,})/i;
const AMAZON_ASIN_EXTRACTOR_REGEX = /\/([A-Z0-9]{10})(?:[\?\/%]|$)/i;

registerOption((siteSettings, opts) => {
  opts.features.affiliate = siteSettings.affiliate_enabled;
  opts.amazonTag = siteSettings.affiliate_amazon_tag;
});

export function setup(helper) {
  helper.addPreProcessor(text => {
    return text.replace(AMAZON_LINK_REGEX, href => {
      if (AMAZON_DOMAIN_EXTRACTOR_REGEX.test(href)) {
        const domain = AMAZON_DOMAIN_EXTRACTOR_REGEX.exec(href)[1];
        const prefix = (href.indexOf("smile.amazon") !== -1) ? "smile" : "www";

        if (AMAZON_ASIN_EXTRACTOR_REGEX.test(href)) {
          const asin = AMAZON_ASIN_EXTRACTOR_REGEX.exec(href)[1];
          href = `https://${prefix}.amazon.${domain}/dp/${asin}`;

          const amazonTag = helper.getOptions().amazonTag;
          if (amazonTag && amazonTag.length > 0) {
            href += "?tag=" + amazonTag;
          }
        }
      }
      return href;
    });
  });
}
