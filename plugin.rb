# frozen_string_literal: true

# name: discourse-affiliate
# about: Official affiliation plugin for Discourse
# version: 0.2
# authors: Régis Hanol (zogstrip), Sam Saffron
# url: https://github.com/discourse/discourse-affiliate

enabled_site_setting :affiliate_enabled

after_initialize do
  require File.expand_path(File.dirname(__FILE__) + "/lib/affiliate_processor")

  on(:post_process_cooked) do |doc, post|
    doc.css("a[href]").each { |a| a["href"] = AffiliateProcessor.apply(a["href"]) }
    true
  end
end
