"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { fetchCars } from "@/lib/fetchCars";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import DateRangeCalendar from "@/app/components/DateRangeCalendar";
import { Button } from "@nextui-org/button";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { LuCar } from "react-icons/lu";
import { IoMdSpeedometer } from "react-icons/io";
import { TbManualGearbox } from "react-icons/tb";
import { PiSeatbelt } from "react-icons/pi";
import { FaArrowLeft } from "react-icons/fa";

const InfoItem = ({ icon: Icon, label, value }) => {
  let displayValue = value;
  if (label === "fuel" && value === "benzine") displayValue = "Gasoline";

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2">
        <Icon className="text-2xl text-blue-600" />
        <span className="font-semibold text-gray-700 capitalize">{label}:</span>
      </div>
      <p className="text-lg text-gray-600 ml-8">{displayValue}</p>
    </div>
  );
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const allCars = await fetchCars();
        const foundCar = allCars.find((c) => c.id === parseInt(params.id));
        setCar(foundCar);

        // Fetch booked dates for this car
        if (foundCar) {
          const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
          const response = await fetch(
            `${backendUrl}/api/bookings/car/${foundCar.id}/booked-dates`
          );
          if (response.ok) {
            const data = await response.json();
            setBookedDates(data.bookedDates || []);
          }
        }
      } catch (err) {
        console.error("Error loading car:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCar();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[10vh]">
        <div className="text-2xl text-gray-600">Loading car details...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-[10vh] gap-4">
        <div className="text-2xl text-gray-600">Car not found</div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const getPrice = (car) => {
    return car.price || "N/A";
  };

  const handleDateRangeChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);

    // Calculate total cost
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const dailyPrice = parseInt(getPrice(car)) || 0;
      setTotalCost(diffDays * dailyPrice);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-gray-100 rounded-lg p-6 sm:p-8 mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {car.data?.year || "Year N/A"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/80 px-4 py-2 rounded-full text-green-900 font-semibold">
                Available
              </div>
              <button onClick={() => setIsLiked(!isLiked)}>
                {isLiked ? (
                  <AiFillHeart className="text-4xl text-red-500 hover:scale-110 transition" />
                ) : (
                  <AiOutlineHeart className="text-4xl text-gray-400 hover:scale-110 transition" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg p-6 sm:p-8 shadow-md">
            <div className="relative w-full h-96 mb-6">
              {car.imagefront ? (
                <Image
                  src={car.imagefront}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain"
                  style={{
                    filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {car.description ||
                  `Experience the perfect blend of performance and luxury with the ${car.brand} ${car.model}. 
                   This premium vehicle offers exceptional comfort, advanced technology, and outstanding fuel efficiency. 
                   Ideal for both city drives and long-distance adventures, the ${car.brand} ${car.model} provides a smooth, 
                   responsive ride with a sophisticated interior design that will exceed your expectations.`}
              </p>

              <div className="my-8 border-t pt-8">
                <DateRangeCalendar
                  onDateRangeChange={handleDateRangeChange}
                  bookedDates={bookedDates}
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-t pt-8">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem
                  icon={LuCar}
                  label="Chassis"
                  value={car.data?.chassis || "N/A"}
                />
                <InfoItem
                  icon={IoMdSpeedometer}
                  label="Fuel"
                  value={car.data?.fuel || "N/A"}
                />
                <InfoItem
                  icon={TbManualGearbox}
                  label="Transmission"
                  value={car.data?.transmission || "N/A"}
                />
                <InfoItem
                  icon={PiSeatbelt}
                  label="Seats"
                  value={`${car.data?.seats || "0"} seats`}
                />
                <InfoItem
                  icon={LuCar}
                  label="Engine"
                  value={car.data?.engine || "N/A"}
                />
                <InfoItem
                  icon={IoMdSpeedometer}
                  label="Color"
                  value={car.data?.color || "N/A"}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-[calc(10vh+2rem)]">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Price per day</p>
                <p className="text-5xl font-bold text-gray-900">
                  ${getPrice(car)}
                </p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate</span>
                  <span className="font-semibold">${getPrice(car)}</span>
                </div>
                {startDate && endDate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Days</span>
                      <span className="font-semibold">
                        {Math.ceil(
                          (endDate - startDate) / (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold bg-blue-50 p-2 rounded">
                      <span className="text-gray-900">Total Cost</span>
                      <span className="text-blue-600">${totalCost}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-semibold text-green-600">In Stock</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    addToCart(car);
                    alert("Added to cart!");
                  }
                }}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
                  user
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={!user}
              >
                {user ? "Add to Cart" : "Login to Rent"}
              </Button>

              <button
                onClick={() => router.push("/offer")}
                className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
