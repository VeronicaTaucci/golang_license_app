package email

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/smtp"
)

type GoogleEmailCredentials struct {
	Email    string
	Password string
}

func SendGoogleEmail(recipient string, content bytes.Buffer, credentials GoogleEmailCredentials) error {
	auth := smtp.PlainAuth("", credentials.Email, credentials.Password, "smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", auth, credentials.Email, []string{recipient}, content.Bytes())
	return err
}

func GenerateLicenseEmailContent(sender string, recipient string, message string, filename string, fileData []byte) bytes.Buffer {
	var emailContent bytes.Buffer

	boundaryMarker := "m24Z9p4STxZmXrp6ZDkmMJxK"

	emailContent.WriteString(fmt.Sprintf("From: %s\r\n", sender))
	emailContent.WriteString(fmt.Sprintf("To: %s\r\n", recipient))
	emailContent.WriteString(fmt.Sprintf("Subject: %s\r\n", "License"))
	emailContent.WriteString("MIME-Version: 1.0\r\n")
	emailContent.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\r\n", boundaryMarker))

	emailContent.WriteString(fmt.Sprintf("\r\n--%s\r\n", boundaryMarker))
	emailContent.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	emailContent.WriteString("\r\n")
	emailContent.WriteString(message)

	encodedFileContent := base64.StdEncoding.EncodeToString(fileData)

	emailContent.WriteString(fmt.Sprintf("\r\n--%s\r\n", boundaryMarker))
	emailContent.WriteString("Content-Type: application/octet-stream\r\n")
	emailContent.WriteString(fmt.Sprintf("Content-Disposition: attachment; filename=\"%s\"\r\n", filename))
	emailContent.WriteString("Content-Transfer-Encoding: base64\r\n")
	emailContent.WriteString("\r\n")
	emailContent.WriteString(encodedFileContent)

	emailContent.WriteString(fmt.Sprintf("\r\n--%s--\r\n", boundaryMarker))
	return emailContent
}
