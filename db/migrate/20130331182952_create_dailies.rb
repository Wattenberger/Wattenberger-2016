class CreateDailies < ActiveRecord::Migration
  def change
    drop_table :dailies

    create_table :dailies do |t|
      t.string :title
      t.date :date
      t.string :image_url
      t.string :description

      t.timestamps
    end
  end
end
