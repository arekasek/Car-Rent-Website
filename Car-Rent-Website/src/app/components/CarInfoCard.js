"use client";
import React from "react";
import Image from "next/image";
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
      1: "xl:grid-cols-1",
      2: "xl:grid-cols-2",
    }[cols] || "xl:grid-cols-2";

  return (
    <div
      className={`h-auto w-full grid grid-cols-1 ${colClass} gap-8 md:gap-6 lg:gap-10`}
    >
      {sortedCars.map((car, index) => (
        <div
          key={car.id ?? index}
          className="card-item-shadow flex flex-col items-center gap-4 justify-center p-4 sm:p-6 rounded-lg w-full relative"
        >
          <div className="absolute top-0 right-0 z-10 flex flex-row items-center">
            <div className="bg-green-500/50 p-2 rounded-lg text-green-800 font-sans font-semibold">
              Available now
            </div>

            {likedCars.includes(car) ? (
              <AiFillHeart
                className="text-2xl sm:text-3xl m-4 text-red-500 cursor-pointer"
                onClick={() => handleLike(car)}
              />
            ) : (
              <AiOutlineHeart
                className="text-2xl sm:text-3xl m-4 text-gray-500 cursor-pointer"
                onClick={() => handleLike(car)}
              />
            )}
          </div>

          <div className="relative w-[400px] h-[160px]">
            {car.imagefront ? (
              <Image
                src={car.imagefront}
                alt="car image"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="flex flex-row justify-between items-center">
              <div>
                <h2 className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900/90">
                  {car.brand} <span className="font-sans">{car.model}</span>
                </h2>
                <h3 className="text-gray-500 font-sans">{car.data?.engine}</h3>
              </div>

              <div className="relative flex flex-row items-baseline">
                <h3>
                  <span className="text-4xl font-sans">{getPrice(car)}$</span>
                </h3>
                <p className="translate-y-[5px] text-gray-500 font-sans">
                  /day
                </p>
              </div>
            </div>

            <div className="line w-full border-b-2 border-black my-2 opacity-10"></div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 md:gap-8 w-full justify-center">
            <InfoItem icon={LuCar} label="chassis" value={car.data?.chassis} />
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

          <Button
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
          </Button>
        </div>
      ))}
    </div>
  );
}

export default CarInfoCard;
