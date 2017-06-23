require 'rails_helper'
require 'html_normalize'

describe PrettyText do

  def n(html)
    HtmlNormalize.normalize(html)
  end

  context 'markdown it' do

    before do
      SiteSetting.enable_experimental_markdown_it = true
    end

    after do
      SiteSetting.enable_experimental_markdown_it = false
    end

    it 'can add affiliates correctly' do
      SiteSetting.enable_experimental_markdown_it = false

      amazon_product = "https://www.amazon.com/gp/product/B01LWVX2RG/ref=s9u_simh_gw_i1?ie=UTF8&th=1"
      SiteSetting.affiliate_amazon_com = 'awesome-code'

      md = "an autolink #{amazon_product} an html link <a href='#{amazon_product}'>test</a> an explicit link [link](#{amazon_product}) escaped `#{amazon_product}` X#{amazon_product}"

      cooked = PrettyText.cook(md)

      # correct behavior at the moment is nuking query string
      # ensure we don't mess stuff up in non hyperlinks
      expect(cooked.scan('?tag=awesome-code').length).to eq(3)
    end

  end
end
