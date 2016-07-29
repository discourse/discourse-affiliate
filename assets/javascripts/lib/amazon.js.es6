const AMAZON_DOMAINS = ["amazon.ca", "amazon.cn", "amazon.co.jp", "amazon.co.uk", "amazon.com", "amazon.com.au", "amazon.com.br", "amazon.com.mx", "amazon.de", "amazon.es", "amazon.fr", "amazon.in", "amazon.it", "amazon.nl"];
const AMAZON_ASIN_REGEX = /\/([A-Z0-9]{10})(?:[\?\/%]|$)/i;

export function amazon(text, helper) {
  const tags = helper.getOptions().tags;
  for (const domain of AMAZON_DOMAINS) {
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
  }
  return text;
}
