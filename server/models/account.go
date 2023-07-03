package models

import (
	"gorm.io/gorm"
)

type Account struct {
	ID          uint           `gorm:"primaryKey"`
	Description string         `json:"description"`
	MaxUsers    int32          `json:"maxUsers"`
	MaxCores    int32          `json:"maxCores"`
	FirstName   string         `json:"firstName"`
	LastName    string         `json:"lastName"`
	Company     string         `json:"company"`
	LicenseType string         `json:"licenseType"`
	Email       string         `json:"email"`
	Exp         int64          `json:"exp"`
	Iat         int64          `json:"iat"`
	Token       string         `json:"token"`
	CreatedBy   string         `json:"createdBy"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

type RequestData struct {
	Account Account `json:"account"`
	Exp     int64   `json:"exp"`
	Iat     int64   `json:"iat"`
}
