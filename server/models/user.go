package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email           string
	Password        []byte `json:"password"`
	Username        string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	Role            string
	TokenRecover    string
	TokenRecoverExp time.Time
	DeletedAt       gorm.DeletedAt `gorm:"index"`
}
