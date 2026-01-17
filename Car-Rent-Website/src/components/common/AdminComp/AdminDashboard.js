"use client";

import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiBook,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";
import { Loader } from "../Loader";
import { StatsCard } from "./StatsCard";
import { CarsTable } from "./CarsTable";
import { AddCarForm } from "./AddCarForm";
import { RentalSchedule } from "./RentalSchedule";

const AdminDashboard = () => {
  const { session } = useAuth();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cars");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    color: "",
    imagefront: "",
    image: "",
    price: 0,
    data: {
      fuel: "",
      year: "",
      doors: "",
      drive: "",
      seats: "",
      engine: "",
      chassis: "",
      horsePower: "",
      description: "",
      transmission: "",
    },
  });

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCars();
    if (session?.access_token) {
      fetchBookings();
    }
  }, [session?.access_token]);

  const fetchCars = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${backendUrl}/api/cars`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const carsData = data.data || data;
      setCars(Array.isArray(carsData) ? carsData : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setLoading(false);
      alert("Failed to load cars. Make sure the backend is running.");
    }
  };

  const fetchBookings = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const headers = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${backendUrl}/api/bookings`, {
        signal: controller.signal,
        headers,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: isNaN(value) ? value : Number(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: isNaN(value) ? value : name === "price" ? Number(value) : value,
      });
    }
  };

  const handleEdit = (car) => {
    setEditingId(car.id);
    setFormData(car);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const headers = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`${backendUrl}/api/cars/${editingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Car updated successfully!");
          fetchCars();
          setShowForm(false);
          setEditingId(null);
          resetForm();
        } else {
          alert("Failed to update car");
        }
      } else {
        const headers = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`${backendUrl}/api/cars`, {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Car created successfully!");
          fetchCars();
          setShowForm(false);
          resetForm();
        } else {
          alert("Failed to create car");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving car");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${backendUrl}/api/cars/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        alert("Car deleted successfully!");
        fetchCars();
      } else {
        alert("Failed to delete car");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting car");
    }
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      color: "",
      imagefront: "",
      image: "",
      price: 0,
      data: {
        fuel: "",
        year: "",
        doors: "",
        drive: "",
        seats: "",
        engine: "",
        chassis: "",
        horsePower: "",
        description: "",
        transmission: "",
      },
    });
  };

  if (loading) {
    return <Loader fullScreen={true} message="Loading Dashboard..." />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCarRentals = () => {
    const carRentals = {};

    cars.forEach((car) => {
      carRentals[car.id] = {
        car: car,
        rentals: bookings.filter(
          (b) => b.car_id === car.id && b.status === "confirmed",
        ),
      };
    });

    return carRentals;
  };

  const getTotalRevenue = () => {
    return bookings.reduce((total, booking) => {
      return total + (booking.total_price || 0);
    }, 0);
  };

  const getMostPopularCar = () => {
    if (cars.length === 0 || bookings.length === 0) return null;

    let mostPopular = null;
    let maxBookings = 0;

    cars.forEach((car) => {
      const carBookings = bookings.filter(
        (b) => b.car_id === car.id && b.status === "confirmed",
      ).length;
      if (carBookings > maxBookings) {
        maxBookings = carBookings;
        mostPopular = { car, count: carBookings };
      }
    });

    return mostPopular;
  };

  return (
    <div className=" bg-gray-200 min-h-screen flex flex-row w-full">
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("cars")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "cars"
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Cars Management
          </button>
          <button
            onClick={() => setActiveTab("rentals")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "rentals"
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Car Rentals
          </button>
        </div>

        {/* Cars Management Tab */}
        {activeTab === "cars" && (
          <>
            <div className="flex flex-row items-center gap-6 mb-8 flex-wrap">
              <StatsCard
                icon={FaCar}
                title="Amount of cars"
                value={cars.length}
                bgColor="bg-gray-400"
              />
              <StatsCard
                icon={FiBook}
                title="Amount of bookings"
                value={bookings.length}
                bgColor="bg-gray-500"
              />
              <StatsCard
                icon={FiDollarSign}
                title="Total Revenue"
                value={`$${getTotalRevenue().toFixed(2)}`}
                bgColor="bg-gray-600"
              />
              <StatsCard
                icon={FiTrendingUp}
                title="Most Popular Car"
                value={
                  getMostPopularCar()
                    ? `${getMostPopularCar().car.brand} ${
                        getMostPopularCar().car.model
                      }`
                    : "N/A"
                }
                bgColor="bg-gray-700"
              />
            </div>
            <AddCarForm
              showForm={showForm}
              setShowForm={setShowForm}
              editingId={editingId}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onReset={resetForm}
            />
            <CarsTable
              cars={cars}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {cars.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <p>No cars found. Create your first car!</p>
              </div>
            )}
          </>
        )}

        {activeTab === "rentals" && (
          <RentalSchedule
            cars={cars}
            bookings={bookings}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
