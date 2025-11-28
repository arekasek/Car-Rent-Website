# Car Rental Backend API

Node.js Express backend for the Car Rental application, integrated with Supabase.

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Cars

- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (admin)
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Bookings

- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments

- `GET /api/payments/user/:userId` - Get user's payments
- `POST /api/payments` - Create payment

## Architecture

- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **CORS:** Enabled for frontend

## Database Schema (Supabase)

### cars table

```sql
- id: bigint (primary key)
- brand: text
- model: text
- color: text
- imagefront: text
- data: jsonb
- created_at: timestamp
```

### bookings table

```sql
- id: bigint (primary key)
- user_id: text
- car_id: bigint
- start_date: date
- end_date: date
- total_price: numeric
- status: text
- created_at: timestamp
```

### payments table

```sql
- id: bigint (primary key)
- user_id: text
- booking_id: bigint
- amount: numeric
- payment_method: text
- stripe_id: text
- status: text
- created_at: timestamp
```

## Integration with Frontend

The Next.js frontend can now call this backend instead of using Next.js API routes:

```javascript
// Instead of /api/cars, call backend
const response = await fetch("http://localhost:5000/api/cars");
const cars = await response.json();
```

Update the frontend's `fetchCars()` function to point to the backend URL.
