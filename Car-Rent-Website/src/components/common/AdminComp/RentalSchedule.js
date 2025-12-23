"use client";

import { RentalTable } from "./RentalTable";

export const RentalSchedule = ({ cars, bookings, formatDate }) => {
  const getCarRentals = () => {
    const carRentals = {};

    cars.forEach((car) => {
      carRentals[car.id] = {
        car: car,
        rentals: bookings.filter(
          (b) => b.car_id === car.id && b.status === "confirmed"
        ),
      };
    });

    return carRentals;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Car Rental Schedule
      </h2>
      {cars.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No cars found. Create a car first to see rental information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {getCarRentals() &&
            Object.values(getCarRentals()).map(({ car, rentals }) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-gray-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-blue-100">
                    {rentals.length} active rental
                    {rentals.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {rentals.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>This car is currently available - no active rentals</p>
                  </div>
                ) : (
                  <RentalTable rentals={rentals} formatDate={formatDate} />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
