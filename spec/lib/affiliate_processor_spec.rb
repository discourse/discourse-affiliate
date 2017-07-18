require 'rails_helper'

describe AffiliateProcessor do

  def r(url)
    AffiliateProcessor.apply(url)
  end

  it 'can apply affiliate code to ldlc' do
    SiteSetting.affiliate_ldlc_com = 'samsshop'

    expect(r('http://www.ldlc.com/some_product?xyz=1')).to eq('http://www.ldlc.com/some_product?xyz=1#samsshop')
    expect(r('https://ldlc.com/some_product?xyz=1')).to eq('https://ldlc.com/some_product?xyz=1#samsshop')
  end

  it 'can apply affiliate code correctly' do
    SiteSetting.affiliate_amazon_com = 'sams-shop'
    SiteSetting.affiliate_amazon_com_au = 'au-sams-shop'

    expect(r('http://www.amazon.com/some_product?xyz=1')).to eq('http://www.amazon.com/some_product?tag=sams-shop')
    expect(r('https://www.amazon.com/some_product?xyz=1')).to eq('https://www.amazon.com/some_product?tag=sams-shop')
    expect(r('https://amzn.com/some_product?xyz=1')).to eq('https://amzn.com/some_product?tag=sams-shop')

    expect(r('https://smile.amazon.com/some_product?xyz=1')).to eq('https://smile.amazon.com/some_product?tag=sams-shop')

    expect(r('https://www.amazon.com.au/some_product?xyz=1')).to eq('https://www.amazon.com.au/some_product?tag=au-sams-shop')
  end

  it 'can apply codes to post in post processor' do
    SiteSetting.affiliate_amazon_com = 'sams-shop'

    post = create_post(raw: 'this is an www.amazon.com/link?testing yay')
    post.reload

    expect(post.cooked.scan('sams-shop').length).to eq(1)
  end

end
