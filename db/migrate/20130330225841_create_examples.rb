class CreateExamples < ActiveRecord::Migration
  def change
    create_table :examples do |t|
      t.string :title
      t.text :description
      t.string :image_url
      t.date :date

      t.timestamps
    end
  end
end
