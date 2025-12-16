# Lab Scheduling System API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All endpoints except `/auth/register` and `/auth/login` require JWT token.

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/updatedetails` - Update user details

### Users (Admin only)
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Labs
- `GET /labs` - Get all labs
- `POST /labs` - Create lab (Admin)
- `GET /labs/available` - Check available labs
- `GET /labs/stats` - Get lab statistics

### Bookings
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create booking
- `GET /bookings/availability` - Check availability
- `PUT /bookings/:id/approve` - Approve booking (Admin)

## Example Requests

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lab": "lab_id",
    "title": "Web Development Class",
    "date": "2024-01-20",
    "startTime": "09:00",
    "endTime": "11:00",
    "participants": 25
  }'