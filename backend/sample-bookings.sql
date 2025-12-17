-- Insert sample bookings into the bookings table
-- These queries add random bookings for testing purposes

-- Sample Booking 1: BMW M4 (Car ID 1) - Next week
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-1',
  1,
  CURRENT_DATE + INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '5 days',
  1200.00,
  'confirmed'
);

-- Sample Booking 2: Ferrari (Car ID 2) - This weekend
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-2',
  2,
  CURRENT_DATE + INTERVAL '1 days',
  CURRENT_DATE + INTERVAL '3 days',
  3000.00,
  'confirmed'
);

-- Sample Booking 3: Lamborghini (Car ID 3) - Next month
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-3',
  3,
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '35 days',
  4500.00,
  'confirmed'
);

-- Sample Booking 4: Tesla Model S (Car ID 4) - Mid-month
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-4',
  4,
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '15 days',
  800.00,
  'confirmed'
);

-- Sample Booking 5: Porsche (Car ID 5) - Two weeks
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-5',
  5,
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '14 days',
  2800.00,
  'confirmed'
);

-- Sample Booking 6: BMW M4 (Car ID 1) - Another booking for same car
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-6',
  1,
  CURRENT_DATE + INTERVAL '20 days',
  CURRENT_DATE + INTERVAL '25 days',
  1000.00,
  'confirmed'
);

-- Sample Booking 7: Cancelled booking (Status: cancelled)
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-7',
  2,
  CURRENT_DATE + INTERVAL '50 days',
  CURRENT_DATE + INTERVAL '55 days',
  3000.00,
  'cancelled'
);

-- Sample Booking 8: Past booking (completed)
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-8',
  3,
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE - INTERVAL '5 days',
  2250.00,
  'completed'
);

-- Sample Booking 9: Ferrari (Car ID 2) - Another upcoming booking
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-9',
  2,
  CURRENT_DATE + INTERVAL '40 days',
  CURRENT_DATE + INTERVAL '45 days',
  3250.00,
  'confirmed'
);

-- Sample Booking 10: Tesla (Car ID 4) - Long term rental
INSERT INTO public.bookings (user_id, car_id, start_date, end_date, total_price, status)
VALUES (
  'user-sample-10',
  4,
  CURRENT_DATE + INTERVAL '25 days',
  CURRENT_DATE + INTERVAL '40 days',
  3200.00,
  'confirmed'
);

-- View all bookings to verify
SELECT * FROM public.bookings ORDER BY created_at DESC;

-- View bookings for specific car (example: car_id = 1)
SELECT * FROM public.bookings WHERE car_id = 1 ORDER BY start_date;

-- View confirmed bookings only
SELECT * FROM public.bookings WHERE status = 'confirmed' ORDER BY start_date;

-- View booked dates for car 1 (BMW M4)
SELECT 
  car_id,
  start_date,
  end_date,
  (end_date - start_date) as duration_days,
  user_id,
  total_price,
  status
FROM public.bookings 
WHERE car_id = 1 AND status = 'confirmed'
ORDER BY start_date;
