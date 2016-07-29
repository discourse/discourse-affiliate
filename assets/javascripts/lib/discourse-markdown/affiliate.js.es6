import { registerOption } from 'pretty-text/pretty-text';
import { amazon } from 'discourse/plugins/discourse-affiliate/lib/amazon';
import { ldlc } from 'discourse/plugins/discourse-affiliate/lib/ldlc';

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
