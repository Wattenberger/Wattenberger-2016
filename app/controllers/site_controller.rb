class SiteController < ApplicationController
  def main
    @examples = Example.find(:all)
    @dailies = ((Daily.find(:all)).sort_by(&:date)).reverse
  end
end
