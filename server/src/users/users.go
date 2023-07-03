package user

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"license/models"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(c *gin.Context, db *gorm.DB) {
	error := godotenv.Load(".env")
	if error != nil {
		log.Fatal("Error loading .env file")
	}
	signingKey := []byte(os.Getenv("USER_SIGN_KEY"))
	var userData struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := c.ShouldBindJSON(&userData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	var existingUser models.User
	result := db.Where("email = ?", userData.Email).First(&existingUser)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		fmt.Println("test")
		panic(result.Error)
	}
	fmt.Println(existingUser)

	if existingUser.ID != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	newUser := models.User{
		Email:    userData.Email,
		Username: userData.Username,
		Password: hashedPassword,
	}

	var users []models.User
	allUsers := db.Find(&users)
	if allUsers.Error != nil {
		panic(allUsers.Error)
	}

	if len(users) == 0 {
		newUser.Role = "Admin"
	} else {
		newUser.Role = "Reader"
	}

	result = db.Create(&newUser)
	if result.Error != nil {
		panic(result.Error)
	}

	// Generate JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       newUser.ID,
		"email":    newUser.Email,
		"password": newUser.Password,
		"exp":      expirationTime.Unix(),
	})

	// Sign the token with the signing key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusCreated, gin.H{"token": tokenString})
}

func GetAll(c *gin.Context, db *gorm.DB) {
	var users []models.User
	result := db.Order("id DESC").Find(&users)
	if result.Error != nil {
		panic(result.Error)
	}
	c.JSON(http.StatusOK, users)
}

func UpdateRole(c *gin.Context, db *gorm.DB) {
	accountID := c.Param("id")

	var updatedData models.User

	// Parse the JSON data
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	var user models.User
	result := db.First(&user, accountID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Role = updatedData.Role

	result = db.Save(&user)
	if result.Error != nil {
		panic(result.Error)
	}

	c.JSON(http.StatusOK, gin.H{"message": "User's role successfully updated"})
}

func GenerateRandomToken(length int) (string, error) {
	token := make([]byte, length)
	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(token)[:length], nil
}

func SendEmailToResetPassword(c *gin.Context, db *gorm.DB) {
	token, error := GenerateRandomToken(32) // Generate a token of length 32
	if error != nil {
	}
	type ResetRequest struct {
		Email string `json:"email"`
	}

	var resetRequest ResetRequest
	if error := c.ShouldBindJSON(&resetRequest); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	Email := resetRequest.Email

	subject := "License Manager Password Reset"

	// Create buffer for email content
	var emailContent bytes.Buffer

	// Write the email headers for the first recipient
	emailContent.WriteString(fmt.Sprintf("From: %s\r\n", "1trythisemail1@gmail.com"))
	emailContent.WriteString(fmt.Sprintf("To: %s\r\n", Email))
	emailContent.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	emailContent.WriteString("MIME-Version: 1.0\r\n")
	emailContent.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\r\n", "boundary123"))

	// Write the message part of the email for the first recipient
	emailContent.WriteString(fmt.Sprintf("\r\n--%s\r\n", "boundary123"))
	emailContent.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	emailContent.WriteString("\r\n")
	emailContent.WriteString("You have requested to reset your password. Please click the link below to proceed with the password reset:\r\n\r\n")
	emailContent.WriteString(fmt.Sprintf("http://localhost:3000/reset/%s", token))
	emailContent.WriteString("\r\n\r\n")
	emailContent.WriteString("If you did not initiate this password reset request, you can safely ignore this email.\r\n")
	emailContent.WriteString("Thank you.\r\n")
	emailContent.WriteString(fmt.Sprintf("\r\n--%s--\r\n", "boundary123"))

	// Set up SMTP authentication
	auth := smtp.PlainAuth("", "1trythisemail1@gmail.com", "wuqkwdjyxolfhuxu", "smtp.gmail.com") // Replace with sender's email and password

	// Send the email to the first recipient
	err := smtp.SendMail("smtp.gmail.com:587", auth, "1trythisemail1@gmail.com", []string{Email}, emailContent.Bytes())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	UpdateUserTokenForPasswordReset(db, Email, token)
	if err := UpdateUserTokenForPasswordReset(db, Email, token); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully", "token": token})
}

func UpdateUserTokenForPasswordReset(db *gorm.DB, email string, token string) error {
	var user models.User
	result := db.First(&user, "email = ?", email)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return errors.New("Email not found")
		}
		return result.Error
	}

	// Set the token and its expiration time
	user.TokenRecover = token
	user.TokenRecoverExp = time.Now().Add(15 * time.Minute)

	result = db.Save(&user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func SetNewPassword(c *gin.Context, db *gorm.DB) {
	var userData struct {
		Email    string `json:"email"`
		Password string `json:"newPass"`
		Token    string `json:"token"`
	}

	err := c.ShouldBindJSON(&userData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	// Verify the token
	valid := verifyResetToken(db, userData.Email, userData.Token)
	if !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userData.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	if err != nil {
		panic(err)
	}
	var user models.User
	result := db.First(&user, "email = ?", userData.Email)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	user.Password = hashedPassword

	result = db.Save(&user)
	if result.Error != nil {
		panic(result.Error)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password successfully reset"})
}

func verifyResetToken(db *gorm.DB, email string, token string) bool {
	var user models.User
	result := db.First(&user, "email = ?", email)
	if result.Error != nil {
		return false
	}

	storedToken := user.TokenRecover
	if storedToken != token {
		return false
	}

	if time.Now().After(user.TokenRecoverExp) {
		return false
	}

	return true
}

func Login(c *gin.Context, db *gorm.DB) {
	error := godotenv.Load(".env")
	if error != nil {
		log.Fatal("Error loading .env file")
	}
	signingKey := []byte(os.Getenv("USER_SIGN_KEY"))

	var userData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := c.ShouldBindJSON(&userData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	var user models.User
	result := db.Where("email = ?", userData.Email).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		} else {
			panic(result.Error)
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"email":    user.Email,
		"username": user.Username,
		"exp":      expirationTime.Unix(),
		"role":     user.Role,
	})

	// Sign the token with the signing key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "role": user.Role, "username": user.Username})
}
