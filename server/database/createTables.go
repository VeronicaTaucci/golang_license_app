package database

import (
	"license/models"

	"gorm.io/gorm"
)

func CreateTables(db *gorm.DB) {
	if !db.Migrator().HasTable(&models.User{}) {
		err := db.Migrator().CreateTable(&models.User{})
		if err != nil {
			panic(err)
		}
	}

	if !db.Migrator().HasTable(&models.Account{}) {
		err := db.Migrator().CreateTable(&models.Account{})
		if err != nil {
			panic(err)
		}
	}
}
