package category_repository

type Category struct {
    ID string `gorm:"column:id"`
    Name string `gorm:"column:name"`
}

func (Category) TableName() string {
  return "categories"
}
