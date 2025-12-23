"use client";
import React, { useState, useEffect } from "react";
import { fetchCars } from "@/lib/fetchCars";
import FilterContainer from "@/components/car/FilterContainer";
import SortingBar from "@/components/car/SortingBar";
import CarInfoCard from "@/components/car/CarInfoCard";

export default function Page() {
  const [cars, setCars] = useState([]);
  const [cols, setCols] = useState(2);
  const [filters, setFilters] = useState({
    search: "",
    fuels: [],
    chassis: [],
    transmissions: [],
    seats: [],
  });
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchCars()
      .then((data) => {
        console.log("Fetched cars (page):", data?.length ?? 0);
        setCars(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("fetchCars error:", err);
        setCars([]);
      });
  }, []);

  return (
    <div className="flex items-center justify-center pt-0">
      <div className="w-full h-full flex flex-col md:flex-row">
        <FilterContainer onFilterChange={setFilters} />

        <div className="flex-1 flex flex-col gap-4 w-full">
          <SortingBar onSortChange={setSortOption} onColsChange={setCols} />
          <CarInfoCard
            cars={cars}
            filters={filters}
            sortOption={sortOption}
            cols={cols}
          />
        </div>
      </div>
    </div>
  );
}
