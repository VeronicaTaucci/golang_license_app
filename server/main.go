package main

import (
	"fmt"
	"log"

	"license/database"
	"license/models"
	"license/router"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func main() {
	var db *gorm.DB
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db = database.ConnectToDB()
	err = db.AutoMigrate(&models.User{}, &models.Account{})
	if err != nil {
		panic(err)
	}
	database.CreateTables(db)
	router := router.SetupRouter(db)

	fmt.Println("Server started on port 8080")
	err = router.Run(":8080")
	if err != nil {
		panic(err)
	}
}
