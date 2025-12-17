"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@nextui-org/button";

import { LuCar } from "react-icons/lu";
import { IoMdSpeedometer } from "react-icons/io";
import { TbManualGearbox } from "react-icons/tb";
import { PiSeatbelt } from "react-icons/pi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const InfoItem = ({ icon: Icon, label, value }) => {
  let displayValue = value;
  if (label === "fuel" && value === "benzine") displayValue = "Gasoline";

  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Icon className="text-sm sm:text-2xl text-slate-700" />
      <p className="text-xs sm:text-base text-gray-500">{displayValue}</p>
    </div>
  );
};

function CarInfoCard({
  cars = [],
  filters = {
    search: "",
    fuels: [],
    chassis: [],
    transmissions: [],
    seats: [],
  },
  sortOption = "",
  cols = 2,
}) {
  const [likedCars, setLikedCars] = React.useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const carList = Array.isArray(cars) ? cars : [];

  const filteredCars = carList.filter((car) => {
    if (!car || !car.data) return false;

    const matchesSearch = `${car.brand || ""} ${car.model || ""}`
      .toLowerCase()
      .includes((filters.search || "").toLowerCase());

    const carFuel = (car.data.fuel || "").toLowerCase();
    const matchesFuel =
      !filters.fuels || filters.fuels.length === 0
        ? true
        : filters.fuels.some(
            (fuel) =>
              (fuel || "").toLowerCase() === carFuel ||
              ((fuel || "").toLowerCase() === "gasoline" &&
                carFuel === "benzine")
          );

    const matchesChassis =
      !filters.chassis || filters.chassis.length === 0
        ? true
        : filters.chassis.some(
            (c) =>
              (c || "").toLowerCase() === (car.data.chassis || "").toLowerCase()
          );

    const matchesTransmission =
      !filters.transmissions || filters.transmissions.length === 0
        ? true
        : filters.transmissions.some(
            (t) =>
              (t || "").toLowerCase() ===
              (car.data.transmission || "").toLowerCase()
          );

    const matchesSeats =
      !filters.seats || filters.seats.length === 0
        ? true
        : filters.seats.some((seat) => {
            if (seat === "5+") return parseInt(car.data.seats || 0, 10) >= 5;
            return (
              parseInt(car.data.seats || 0, 10) === parseInt(seat || 0, 10)
            );
          });

    return (
      matchesSearch &&
      matchesFuel &&
      matchesChassis &&
      matchesTransmission &&
      matchesSeats
    );
  });

  const getPrice = (car) => {
    if (!car) return 0;
    const pCandidates = [
      car.data?.price,
      car.data?.pricePerDay,
      car.price,
      car.pricePerDay,
    ];
    for (const p of pCandidates) {
      if (p === undefined || p === null) continue;
      const n = parseFloat(p);
      if (!isNaN(n)) return n;
    }
    return 23;
  };

  const getSeats = (car) => {
    return parseInt(car?.data?.seats || 0, 10) || 0;
  };

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return getPrice(a) - getPrice(b);
      case "price-desc":
        return getPrice(b) - getPrice(a);
      case "brand-asc":
        return String(a.brand || "").localeCompare(String(b.brand || ""));
      case "brand-desc":
        return String(b.brand || "").localeCompare(String(a.brand || ""));
      case "seats-asc":
      case "seats-low":
        return getSeats(a) - getSeats(b);
      case "seats-desc":
      case "seats-high":
        return getSeats(b) - getSeats(a);
      default:
        return 0;
    }
  });

  React.useEffect(() => {
    console.log("CarInfoCard: received", carList.length, "cars");
    console.log("filters:", filters);
  }, [cars, filters]);

  React.useEffect(() => {
    console.log("CarInfoCard: sortOption =", sortOption);
    console.log(
      "Top 5 after filter (brand, price, seats):",
      sortedCars.slice(0, 5).map((c) => ({
        brand: c.brand,
        model: c.model,
        price: getPrice(c),
        seats: getSeats(c),
      }))
    );
  }, [sortOption, cars, filters]);

  const handleLike = (car) => {
    setLikedCars((prev) =>
      prev.includes(car) ? prev.filter((c) => c !== car) : [...prev, car]
    );
  };

  const colClass =
    {
      1: "xl:grid-cols-2",
      2: "xl:grid-cols-3",
    }[cols] || "xl:grid-cols-3";

  const carAbilities = (car) => {
    return (
      <>
        <p className="font-sans text-sm text-gray-700 border border-gray-500/50 px-5 py-1 rounded-lg ">
          {car.data.engine || "Engine info not available"}
        </p>
        <p className="font-sans text-sm text-gray-700 border border-gray-500/50 px-5 py-1 rounded-lg ">
          {car.data?.chassis || "Chassis info not available"}
        </p>
      </>
    );
  };

  return (
    <div
      className={`h-auto w-full grid grid-cols-1 ${colClass} p-6 gap-8 md:gap-6 lg:gap-6`}
    >
      {sortedCars.map((car, index) => (
        <div
          key={car.id ?? index}
          className="flex flex-col items-center gap-4 w-full relative p-6 overflow-hidden bg-gradient-to-br from-transparent via-white/80  to-gray-400/50 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 transform"
          onClick={() => router.push(`/car/${car.id}`)}
        >
          <div className="w-full relative flex flex-row items-center justify-between">
            <div>
              <h2 className="font-sans text-xl font-bold text-gray-900">
                {car.brand} {car.model}
              </h2>
            </div>

            <div className="z-10 flex flex-row items-center gap-2">
              <div className="bg-green-500/80 px-3 py-1 rounded-full text-green-900 font-sans text-xs font-semibold">
                Available
              </div>

              {likedCars.includes(car) ? (
                <AiFillHeart
                  className="text-2xl text-red-500 cursor-pointer hover:scale-110 transition"
                  onClick={() => handleLike(car)}
                />
              ) : (
                <AiOutlineHeart
                  className="text-2xl text-gray-400 cursor-pointer hover:scale-110 transition"
                  onClick={() => handleLike(car)}
                />
              )}
            </div>
          </div>
          <div className="w-full flex flex-row gap-2">{carAbilities(car)}</div>
          <div className="relative w-full h-48 mt-8">
            {car.imagefront ? (
              <Image
                src={car.imagefront}
                alt="car image"
                fill
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))",
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div className="w-full px-5 pb-5">
            <div className="flex flex-row items-baseline gap-1 mb-3">
              <span className="text-3xl font-sans font-bold text-gray-900">
                {getPrice(car)}$
              </span>
              <span className="text-gray-500 font-sans text-sm">/day</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoItem
                icon={LuCar}
                label="chassis"
                value={car.data?.chassis}
              />
              <InfoItem
                icon={IoMdSpeedometer}
                label="fuel"
                value={car.data?.fuel}
              />
              <InfoItem
                icon={TbManualGearbox}
                label="transmission"
                value={car.data?.transmission}
              />
              <InfoItem
                icon={PiSeatbelt}
                label="seats"
                value={`${car.data?.seats ?? "0"} seats`}
              />
            </div>
          </div>

          {/* <Button
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                addToCart(car);
              }
            }}
            className={`w-full mt-4 py-2 rounded-lg font-semibold font-sans transition button-offer-shadow ${
              user
                ? `bg-black/50 text-white hover:bg-black/90`
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!user}
            title={user ? "Add to cart" : "Login to add to cart"}
          >
            {user ? "Add to Cart" : "Login to Add to Cart"}
          </Button> */}
        </div>
      ))}
    </div>
  );
}

export default CarInfoCard;
