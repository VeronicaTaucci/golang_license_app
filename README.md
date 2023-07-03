# License Manager 

This documentation provides an overview of the Licensing Issuing App, including its main components and functionality. The app is built using Go-lang and PostgreSQL for the backend, and React for the frontend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [API Endpoints](#api-endpoints)

## Introduction

The Licensing Issuing App is designed to manage user accounts and issue licenses for accessing Internal Applications. It consists of two main components:

1. User Management Component: This component provides role-based access control to manage user accounts and licenses. Users with the role of "Reader" can only view the list of accounts and email licenses. On the other hand, users with the roles of "Admin" and "Editor" have additional privileges. They can edit, delete, email licenses, and also issue new licenses.

2. Account Component: This component allows users to register an account. Upon registration, a token is created that contains the account information. This token serves as a license for accessing the Internal Application application.

Please note that users refer to the users of the Licensing Issuing App itself, while accounts represent the list of accounts to whom the licenses have been issued.
### NOTE:
 When the app is accessed for the first time, the initial user who registers will automatically be assigned the role of "Admin." This user will have full privileges to edit, delete, email licenses, and issue new licenses. Subsequent users who register will have the default role of "Reader," which allows them to view the list of accounts and email licenses.


## Features

The Licensing Issuing App offers the following features:

- User registration and account management
- Role-based access control for managing user accounts and licenses
- Token-based licensing system
- Email functionality to send licenses
- CRUD operations for accounts and licenses

## Prerequisites

Before installing and using the app, ensure that you have the following prerequisites:

- Go-lang installed
- PostgreSQL installed and configured
- React installed

## API Endpoints
The Licensing Issuing App provides the following API endpoints:

- /api/accounts: Handles CRUD operations for user accounts.
- /api/licenses: Handles CRUD operations for licenses.
- /api/licenses/email: Sends license emails to users.



