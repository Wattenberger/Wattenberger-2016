# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Example.delete_all
Example.create( :title => 'Icon Font', :description => 'new', :image_url => 'images/icons.png', :date => '1/12/2012' )
Example.create( :title => 'Coffee Robot', :description => 'Prototype for a mobile app that sends your coffee order to a coffee machine, which prepares your drink before you get to the kitchen.  See it live <a href="wattenberger.com/coffeebot">here</a>.', :image_url => 'images/coffee.png', :date => '1/10/2012' )

Daily.delete_all
Daily.create( :title => 'Obama', :description => '', :image_url => 'images/daily/obama.png', :date => '21/1/2013' )
Daily.create( :title => 'Zombie', :description => '', :image_url => 'images/daily/zombie.png', :date => '22/1/2013' )
Daily.create( :title => 'Sheeple', :description => '', :image_url => 'images/daily/sheeple.png', :date => '23/1/2013' )
Daily.create( :title => 'Me', :description => '', :image_url => 'images/daily/me.png', :date => '24/1/2013' )
Daily.create( :title => 'Michael Ceratops', :description => '', :image_url => 'images/daily/cera.png', :date => '25/1/2013' )
Daily.create( :title => 'Giraffe', :description => '', :image_url => 'images/daily/giraffe.jpg', :date => '26/1/2013' )
Daily.create( :title => 'Corel Painter', :description => '', :image_url => 'images/daily/059.JPG', :date => '27/1/2013' )
Daily.create( :title => 'icecream', :description => '', :image_url => 'images/daily/icecream.jpg', :date => '28/1/2013' )
Daily.create( :title => 'Mr T', :description => '', :image_url => 'images/daily/mrt1.jpg', :date => '29/1/2013' )
Daily.create( :title => 'Mermaid I', :description => '', :image_url => 'images/daily/merhair.png', :date => '30/1/2013' )
Daily.create( :title => 'Mermaid II', :description => '', :image_url => 'images/daily/mermaid.png', :date => '31/1/2013' )
Daily.create( :title => 'Sloth', :description => '', :image_url => 'images/daily/sloth.png', :date => '1/2/2013' )
Daily.create( :title => 'Moose', :description => '', :image_url => 'images/daily/moose.png', :date => '2/2/2013' )
Daily.create( :title => 'Almond Milk', :description => '', :image_url => 'images/daily/almondmilk.png', :date => '3/2/2013' )
Daily.create( :title => 'Dinosore', :description => '', :image_url => 'images/daily/dinosore.png', :date => '4/2/2013' )
Daily.create( :title => 'Ceramics', :description => '', :image_url => 'images/daily/ceramics.png', :date => '5/2/2013' )
Daily.create( :title => 'Neck Muscles I', :description => '', :image_url => 'images/daily/neckmuscles2.png', :date => '6/2/2013' )
Daily.create( :title => 'Tweed man', :description => '', :image_url => 'images/daily/frenchie.png', :date => '7/2/2013' )
Daily.create( :title => 'Deer', :description => '', :image_url => 'images/daily/deer.png', :date => '8/2/2013' )
Daily.create( :title => 'Reptile Hand Puppet', :description => '', :image_url => 'images/daily/reptile.png', :date => '9/2/2013' )
Daily.create( :title => 'Neck Muscles II', :description => '', :image_url => 'images/daily/neckmuscles.png', :date => '10/2/2013' )
Daily.create( :title => 'House', :description => '', :image_url => 'images/daily/house.png', :date => '11/2/2013' )
