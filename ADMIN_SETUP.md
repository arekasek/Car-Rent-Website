# Admin Dashboard Setup Guide

## Overview

The admin dashboard allows administrators to manage cars in the rental system with full CRUD (Create, Read, Update, Delete) operations.

## Features

- ✅ Create new cars with full details
- ✅ Edit existing car information (name, price, specs, etc.)
- ✅ Delete cars from the system
- ✅ View all cars in a table format
- ✅ Role-based access control (Admin only)
- ✅ Responsive design

## Setup Instructions

### Step 1: Create Users Table in Supabase

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to make a user admin
CREATE OR REPLACE FUNCTION make_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Make Your User an Admin

Replace `your-email@example.com` with your actual email:

```sql
SELECT make_admin('your-email@example.com');

-- Or manually update:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Step 3: Access the Admin Dashboard

1. Log in with your admin account
2. Click "Admin" in the navbar (will only appear if you have admin role)
3. Navigate to `/admin` in your browser

## Usage

### Adding a New Car

1. Click "Add New Car" button
2. Fill in all car details:
   - Brand, Model, Color
   - Image URL
   - Price per day
   - Fuel type, Chassis type, Transmission
   - Number of seats
   - Performance specs (Horsepower, Top Speed, 0-100 time)
   - Description
3. Click "Create Car"

### Editing a Car

1. Find the car in the table
2. Click "Edit" button
3. Modify any details
4. Click "Update Car"

### Deleting a Car

1. Find the car in the table
2. Click "Delete" button
3. Confirm the deletion

## Database Schema

### Users Table

```
id (UUID) - Primary key, references auth.users
email (VARCHAR) - User email
role (VARCHAR) - 'admin' or 'user'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Cars Table (existing)

```
id (UUID)
brand (VARCHAR)
model (VARCHAR)
color (VARCHAR)
imagefront (VARCHAR)
data (JSONB) - Contains:
  - price (number)
  - fuel (string)
  - chassis (string)
  - transmission (string)
  - seats (number)
  - description (string)
  - specs (object):
    - horsepower (number)
    - topSpeed (number)
    - acceleration (number)
```

## API Endpoints

All car management goes through these backend endpoints:

- **GET** `/api/cars` - Get all cars
- **GET** `/api/cars/:id` - Get single car
- **POST** `/api/cars` - Create new car
- **PUT** `/api/cars/:id` - Update car
- **DELETE** `/api/cars/:id` - Delete car

## Security Features

✅ Role-based access control - Only users with 'admin' role can access `/admin`
✅ Protected route - Redirects non-admin users to home page
✅ Protected route - Redirects non-logged-in users to login page
✅ Session timeout - Sessions expire after 30 minutes of inactivity

## Troubleshooting

### Admin link doesn't appear

- Make sure you've created the users table in Supabase
- Make sure your user's role is set to 'admin' in the database
- Try logging out and logging back in

### Can't access admin dashboard

- Check that you're logged in
- Check your user role in Supabase: `SELECT email, role FROM users;`
- Make sure you've set the role to 'admin'

### Changes not saving

- Check browser console for errors
- Verify backend is running on the correct URL
- Check NEXT_PUBLIC_BACKEND_URL environment variable

## Making Another User Admin

```sql
-- Replace with actual email
SELECT make_admin('another-user@example.com');

-- Verify it worked
SELECT email, role FROM users WHERE email = 'another-user@example.com';
```

## File Locations

- Admin Page: `/src/app/admin/page.js`
- Admin Dashboard Component: `/src/app/components/AdminDashboard.js`
- Backend Auth Routes: `/backend/routes/auth.js`
- Backend Car Routes: `/backend/routes/cars.js`
- SQL Setup: `/backend/migrations/add-admin-role.sql`
