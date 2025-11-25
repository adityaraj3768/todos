# Authentication-Based Todo API

A secure Todo application with user authentication using JWT tokens.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Secure Todos**: Each user can only access their own todos
- **Password Hashing**: Passwords are securely hashed using bcryptjs
- **Token-Based Auth**: JWT tokens with 7-day expiration

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Both endpoints return:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Todos (All require authentication)

All todo endpoints require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Todos
```
GET /todos
```

#### Get Todo by ID
```
GET /todos/:id
```

#### Create Todo
```
POST /todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "completed": false
}
```

#### Update Todo
```
PUT /todos/:id
Content-Type: application/json

{
  "title": "Buy groceries and cook",
  "completed": true
}
```

#### Delete Todo
```
DELETE /todos/:id
```

## Setup and Run

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### 2. Login and get token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### 3. Create a todo (use the token from login)
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"title\":\"Learn Node.js\",\"completed\":false}"
```

### 4. Get all todos
```bash
curl -X GET http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- Each user can only access their own todos
- In production, set `JWT_SECRET` environment variable to a secure random string

## Database Schema

### Users Table
- `id`: INTEGER PRIMARY KEY
- `username`: TEXT UNIQUE
- `email`: TEXT UNIQUE
- `password`: TEXT (hashed)
- `created_at`: DATETIME

### Todos Table
- `id`: INTEGER PRIMARY KEY
- `title`: TEXT
- `completed`: INTEGER (0 or 1)
- `user_id`: INTEGER (foreign key to users)
- `created_at`: DATETIME

## Project Structure

```
todos/
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── todoController.js    # Todo CRUD operations
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   ├── todoModel.js         # Todo database operations
│   └── userModel.js         # User database operations
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── todoRoutes.js        # Todo endpoints
├── db.js                     # Database initialization
├── index.js                  # App entry point
└── package.json
```
