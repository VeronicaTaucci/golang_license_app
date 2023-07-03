package account

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"license/models"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
)

func validateEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	match, err := regexp.MatchString(pattern, email)
	if err != nil {
		return false
	}

	return match
}
func validateExpirationDate(exp int64) bool {
	t := time.Unix(exp, 0)
	today := time.Now()
	providedDate := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	currentDate := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())
	return !providedDate.Before(currentDate)
}
func ValidateData(c *gin.Context) []string {
	var userData models.RequestData
	var errors []string

	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err)
	}
	c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))

	if err := json.Unmarshal(body, &userData); err != nil {
		if userData.Account.MaxUsers > 32767 || userData.Account.MaxUsers <= 0 {
			errors = append(errors, "The maximum number of users should be between 1 and 32767")
		}
		if userData.Account.MaxCores > 32767 || userData.Account.MaxCores <= 0 {
			errors = append(errors, "The maximum number of cores should be between 1 and 32767")
		}
	}
	if !validateEmail(userData.Account.Email) {
		errors = append(errors, "Please enter a valid email")
	}
	if !validateExpirationDate(userData.Exp) {
		errors = append(errors, "Expiration time cannot be earlier than the current time")
	}

	return errors

}
