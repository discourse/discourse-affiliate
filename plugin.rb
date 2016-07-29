# name: discourse-affiliate
# about: Official affiliation plugin for Discourse
# version: 0.1
# authors: Régis Hanol (zogstrip)
# url: https://github.com/discourse/discourse-affiliate

enabled_site_setting :affiliate_enabled

register_asset "javascripts/affiliate_dialect.js", :server_side

after_initialize do

  # rename "affiliate_amazon_tag" site setting to "affiliate_amazon_com"
  if SiteSetting.where(name: "affiliate_amazon_tag").exists?
    SiteSetting.exec_sql("UPDATE site_settings SET name = 'affiliate_amazon_com' WHERE name = 'affiliate_amazon_tag'")
    SiteSetting.refresh!
  end

end
