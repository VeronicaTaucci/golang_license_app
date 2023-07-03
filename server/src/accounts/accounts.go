package account

import (
	"fmt"
	"io/ioutil"
	"license/models"
	"license/src/email"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func Register(c *gin.Context, db *gorm.DB) {
	errors := ValidateData(c)
	if len(errors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}
	var requestData models.RequestData
	if err := c.BindJSON(&requestData); err != nil {
		errField := err.Error()
		fieldName := strings.Split(errField, " ")[0]
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse request body", "field": fieldName})
		return
	}
	iat := time.Now().Unix()

	account := models.Account{
		FirstName:   requestData.Account.FirstName,
		LastName:    requestData.Account.LastName,
		MaxCores:    requestData.Account.MaxCores,
		MaxUsers:    requestData.Account.MaxUsers,
		Description: requestData.Account.Description,
		Company:     requestData.Account.Company,
		Email:       requestData.Account.Email,
		CreatedBy:   requestData.Account.CreatedBy,
		LicenseType: requestData.Account.LicenseType,
		Iat:         iat,
		Exp:         requestData.Exp,
	}

	token, err := generateLicenseToken(account)
	if err != nil {
		panic(err)
	}

	account.Token = token

	if result := db.Create(&account); result.Error != nil {
		panic(result.Error)
	}

	if result := db.Save(&account); result.Error != nil {
		panic(result.Error)
	}

	c.JSON(http.StatusCreated, gin.H{"token": token})
}

func GetAll(c *gin.Context, db *gorm.DB) {
	var accounts []models.Account
	result := db.Order("id DESC").Find(&accounts)
	if result.Error != nil {
		panic(result.Error)
	}

	var requestData []models.RequestData
	for _, account := range accounts {
		data := models.RequestData{
			Account: account,
			Exp:     account.Exp,
			Iat:     account.Iat,
		}
		requestData = append(requestData, data)
	}

	c.JSON(http.StatusOK, requestData)
}

func Update(c *gin.Context, db *gorm.DB) {
	errors := ValidateData(c)
	if len(errors) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})
		return
	}
	accountID := c.Param("id")
	var requestData models.RequestData

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	var account models.Account
	result := db.Where("id = ?", accountID).First(&account)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	account.FirstName = requestData.Account.FirstName
	account.LastName = requestData.Account.LastName
	account.MaxCores = requestData.Account.MaxCores
	account.MaxUsers = requestData.Account.MaxUsers
	account.Description = requestData.Account.Description
	account.Company = requestData.Account.Company
	account.Email = requestData.Account.Email
	account.Exp = requestData.Exp
	account.Iat = requestData.Iat

	if err := db.Save(&account).Error; err != nil {
		panic(err)
	}

	newToken, err := generateLicenseToken(account)
	if err != nil {
		panic(err)
	}
	account.Token = newToken

	if err := db.Save(&account).Error; err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"token": newToken})
}

func Delete(c *gin.Context, db *gorm.DB) {
	accountID := c.Param("id")

	result := db.Delete(&models.Account{}, accountID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the account"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Account deleted successfully"})
}

func generateLicenseToken(account models.Account) (string, error) {
	err := godotenv.Load(".env")
	if err != nil {
		return "", fmt.Errorf("error loading .env file: %w", err)
	}

	signingKey := []byte(os.Getenv("LICENSE_SIGN_KEY"))

	claims := jwt.MapClaims{
		"account": map[string]interface{}{
			"description":  account.Description,
			"maxUsers":    account.MaxUsers,
			"maxCores":    account.MaxCores,
			"firstName":   account.FirstName,
			"lastName":    account.LastName,
			"company":     account.Company,
			"licenseType": account.LicenseType,
			"email":       account.Email,
			"createdBy":   account.CreatedBy,
		},
		"exp": account.Exp,
		"iat": account.Iat,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		return "", fmt.Errorf("error signing the token: %w", err)
	}

	return tokenString, nil
}

func SendEmailWithLicense(recipient string, c *gin.Context, db *gorm.DB) {
	message := c.PostForm("message")

	uploadedFile, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	openedUploadedFile, err := uploadedFile.Open()
	defer openedUploadedFile.Close()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fileData, err := ioutil.ReadAll(openedUploadedFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	googleEmailCredentials := email.GoogleEmailCredentials{
		Email:    "1trythisemail1@gmail.com",
		Password: "wuqkwdjyxolfhuxu",
	}
	emailContent := email.GenerateLicenseEmailContent(googleEmailCredentials.Email, recipient, message, uploadedFile.Filename, fileData)
	err = email.SendGoogleEmail(recipient, emailContent, googleEmailCredentials)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
