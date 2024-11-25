<h1 align="center">Welcome to patientmanagementsys 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```


Set up environment variables. Create a .env file in the root of the project with the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


API Endpoints

Authentication
POST /api/auth/register: Register a new user
POST /api/auth/login: Login a user and receive a JWT token

Patients
POST /api/patients: Create a new patient record (Admin/Doctor)
GET /api/patients: Get all patients (Admin), assigned patients (Doctor), or own record (Patient)
GET /api/patients/:id: Get a specific patient record
PUT /api/patients/:id: Update a patient record (Admin/Doctor)
DELETE /api/patients/:id: Delete a patient record (Admin)

Appointments
POST /api/appointments: Create a new appointment (Patient only)
GET /api/appointments: Get all appointments (Admin), assigned appointments (Doctor), or own appointments (Patient)
PUT /api/appointments/:id: Update an appointment (Doctor/Admin)
DELETE /api/appointments/:id: Delete an appointment (Admin only)

Environment Variables
MONGO_URI: MongoDB connection string (for Atlas or local MongoDB)
JWT_SECRET: Secret key used for signing JWT tokens
PORT: Port for the server to run on (default: 5000)

Usage
To register a new user, use the POST /api/auth/register endpoint with the user details in the request body.
After successful registration, use the POST /api/auth/login endpoint to obtain a JWT token.
Use the obtained JWT token in the Authorization header as Bearer {token} for all subsequent API requests.
