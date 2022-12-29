# frozen_string_literal: true

# name: discourse-affiliate
# about: Official affiliation plugin for Discourse
# version: 0.2
# authors: Régis Hanol (zogstrip), Sam Saffron
# url: https://github.com/discourse/discourse-affiliate

enabled_site_setting :affiliate_enabled

after_initialize do
  require File.expand_path(File.dirname(__FILE__) + "/lib/affiliate_processor")

  DiscourseEvent.on(:post_process_cooked) do |doc, post|
    doc.css("a[href]").each { |a| a["href"] = AffiliateProcessor.apply(a["href"]) }
    true
  end

  skip_db = defined?(GlobalSetting.skip_db?) && GlobalSetting.skip_db?

  # rename "affiliate_amazon_tag" site setting to "affiliate_amazon_com"
  if !skip_db
    begin
      if SiteSetting.where(name: "affiliate_amazon_tag").exists?
        SiteSetting.exec_sql(
          "UPDATE site_settings SET name = 'affiliate_amazon_com' WHERE name = 'affiliate_amazon_tag'",
        )
        SiteSetting.refresh!
      end
    rescue ActiveRecord::NoDatabaseError
      nil
    end
  end
end
