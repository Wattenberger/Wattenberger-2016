class Daily < ActiveRecord::Base
  attr_accessible :date, :description, :image_url, :title
end
