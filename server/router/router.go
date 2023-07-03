package router

import (
	account "license/src/accounts"
	user "license/src/users"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	router.Use(cors.New(config))

	router.GET("/user", func(c *gin.Context) {
		user.GetAll(c, db)
	})
	router.POST("/user/login", func(c *gin.Context) {
		user.Login(c, db)
	})
	router.POST("/user/register", func(c *gin.Context) {
		user.Register(c, db)
	})
	router.PUT("/user/:id/role", func(c *gin.Context) {
		user.UpdateRole(c, db)
	})
	router.POST("/user/:id/password/reset", func(c *gin.Context) {
		user.SendEmailToResetPassword(c, db)
	})
	router.PUT("/user/:id/password/reset", func(c *gin.Context) {
		user.SetNewPassword(c, db)
	})
	router.GET("/account", func(c *gin.Context) {
		account.GetAll(c, db)
	})
	router.POST("/account", func(c *gin.Context) {
		account.Register(c, db)
	})

	router.PUT("/account/:id", func(c *gin.Context) {
		account.Update(c, db)
	})
	router.POST("/account/email/send", func(c *gin.Context) {
		primaryRecipient := c.PostForm("primaryRecipient")
		account.SendEmailWithLicense(primaryRecipient, c, db)
		if secondaryRecipient := c.PostForm("secondaryRecipient"); secondaryRecipient != "" {
			account.SendEmailWithLicense(secondaryRecipient, c, db)
		}
	})
	router.DELETE("/account/:id", func(c *gin.Context) {
		account.Delete(c, db)
	})
	return router
}
