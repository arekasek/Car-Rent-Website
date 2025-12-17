"use client";

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function DateRangeCalendar({
  onDateRangeChange,
  bookedDates = [],
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (!startDate) {
      setStartDate(selectedDate);
    } else if (!endDate && selectedDate > startDate) {
      setEndDate(selectedDate);
      onDateRangeChange({ startDate, endDate: selectedDate });
    } else {
      setStartDate(selectedDate);
      setEndDate(null);
    }
  };

  const isDateInRange = (day) => {
    if (!startDate || !endDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date > startDate && date < endDate;
  };

  const isStartDate = (day) => {
    if (!startDate) return false;
    return (
      day === startDate.getDate() &&
      currentDate.getMonth() === startDate.getMonth() &&
      currentDate.getFullYear() === startDate.getFullYear()
    );
  };

  const isEndDate = (day) => {
    if (!endDate) return false;
    return (
      day === endDate.getDate() &&
      currentDate.getMonth() === endDate.getMonth() &&
      currentDate.getFullYear() === endDate.getFullYear()
    );
  };

  const isBooked = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return bookedDates.includes(dateStr);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Select Rental Dates
      </h3>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <h4 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => day && !isBooked(day) && handleDateClick(day)}
            disabled={!day || isBooked(day)}
            className={`
              py-2 px-1 sm:px-2 text-sm font-bold rounded-lg transition
              ${!day ? "bg-transparent" : ""}
              ${
                day && isBooked(day)
                  ? "bg-red-200 text-red-700 cursor-not-allowed opacity-50"
                  : ""
              }
              ${
                day && !isBooked(day) && !isStartDate(day) && !isEndDate(day)
                  ? "bg-gray-100 text-gray-900 hover:bg-blue-100 cursor-pointer"
                  : ""
              }
              ${
                isStartDate(day) || isEndDate(day)
                  ? "bg-blue-600 text-white shadow-lg"
                  : ""
              }
              ${isDateInRange(day) ? "bg-blue-200 text-blue-900" : ""}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Status:</span>{" "}
          {startDate && endDate
            ? `Selected ${getTotalDays()} days`
            : startDate
            ? "Pick an end date"
            : "Pick a start date"}
        </p>
        {startDate && (
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">From:</span>{" "}
            {startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {endDate && (
          <p className="text-sm text-gray-700 mb-3">
            <span className="font-semibold">To:</span>{" "}
            {endDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {startDate && endDate && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">
              Rental Duration: {getTotalDays()} days
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t space-y-2">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legend:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Selected dates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="text-gray-600">In range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span className="text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
