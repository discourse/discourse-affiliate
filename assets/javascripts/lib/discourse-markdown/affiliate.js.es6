import { registerOption } from 'pretty-text/pretty-text';

const LDLC_LINK_REGEX = /((?:https?:)?(?:\/\/)?(?:www\.)?ldlc\.[^\b\s"'<>\(\)\[\]]+)/ig;
const AMAZON_DOMAINS = ["amazon.ca", "amazon.cn", "amazon.co.jp", "amazon.co.uk", "amazon.com", "amazon.com.au", "amazon.com.br", "amazon.com.mx", "amazon.de", "amazon.es", "amazon.fr", "amazon.in", "amazon.it", "amazon.nl"];
const AMAZON_ASIN_REGEX = /\/([A-Z0-9]{10})(?:[\?\/%]|$)/i;

function ldlc(text, helper) {
  const tag = helper.getOptions().tags["ldlc.com"];
  return tag ? text.replace(LDLC_LINK_REGEX, href => `${href}#${tag}`) : text;
}

function amazon(text, helper) {
  const tags = helper.getOptions().tags;

  AMAZON_DOMAINS.forEach(domain => {
    if (tags[domain]) {
      const linkRegex = new RegExp(`((?:https?:)?(?:\\/\\/)?(?:www\\.)?(?:smile\\.)?${domain.replace(".", "\\.")}[^\\b\\s"'<>\\(\\)\\[\\]]+)`, "ig");
      text = text.replace(linkRegex, href => {
        if (AMAZON_ASIN_REGEX.test(href)) {
          const asin = AMAZON_ASIN_REGEX.exec(href)[1];
          const prefix = (href.indexOf("smile.amazon") !== -1) ? "smile" : "www";
          href = `https://${prefix}.${domain}/dp/${asin}?tag=${tags[domain]}`;
        }
        return href;
      });
    }
  });

  // handle short links (eg. `https://amzn.com/B00NZJFQB6`)
  if (tags["amazon.com"]) {
    text = text.replace(/https?:\/\/amzn\.com\/([A-Z0-9]{10})[^\b\s"'<>\(\)\[\]]*/ig, (_, asin) => {
      return `https://amzn.com/${asin}?tag=${tags["amazon.com"]}`;
    });
  }

  return text;
}

registerOption((siteSettings, opts) => {
  opts.tags = {};
  if (opts.features.affiliate = siteSettings.affiliate_enabled) {
    for (const name in siteSettings) {
      if (/^affiliate_.+_.+$/.test(name) && siteSettings[name].trim().length > 0) {
        const domain = /^affiliate_(.+)$/.exec(name)[1].replace("_", ".");
        opts.tags[domain] = siteSettings[name];
      }
    }
  }
});

export function setup(helper) {
  helper.addPreProcessor(text => amazon(text, helper));
  helper.addPreProcessor(text => ldlc(text, helper));
}
