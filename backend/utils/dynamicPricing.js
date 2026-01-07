const supabase = require("../config/supabase");

/**
 * Calculate dynamic price based on occupancy rate in the current month
 * Algorithm: Higher occupancy (fewer available days) = Higher price multiplier
 *
 * Price multiplier tiers based on occupancy:
 * - 0-10% booked: 1.0x (base price)
 * - 11-25% booked: 1.1x (10% increase)
 * - 26-40% booked: 1.25x (25% increase)
 * - 41-60% booked: 1.5x (50% increase)
 * - 61%+ booked: 1.75x (75% increase)
 */
const calculatePriceMultiplier = (occupancyRate) => {
  if (occupancyRate <= 0.1) return 1.0;
  if (occupancyRate <= 0.25) return 1.1;
  if (occupancyRate <= 0.4) return 1.25;
  if (occupancyRate <= 0.6) return 1.5;
  return 1.75;
};

/**
 * Get the occupancy rate for a specific car in the current month
 * Returns the percentage of days that are booked
 */
const getMonthlyOccupancyRate = async (carId) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Get first and last day of current month
    const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];

    // Total days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    console.log(
      `[Pricing] Checking car ${carId} for month ${month + 1}/${year}`
    );
    console.log(`[Pricing] Date range: ${firstDay} to ${lastDay}`);

    // Get all confirmed and completed bookings for this car in the current month
    const { data, error } = await supabase
      .from("bookings")
      .select("start_date, end_date, status")
      .eq("car_id", carId)
      .in("status", ["confirmed", "completed"]);

    if (error) {
      console.error("Error fetching monthly bookings:", error);
      return { bookedDays: 0, occupancyRate: 0, daysInMonth };
    }

    // Filter bookings that overlap with current month
    const bookings = (data || []).filter((booking) => {
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      // Check if booking overlaps with the month
      return bookingStart <= monthEnd && bookingEnd >= monthStart;
    });

    console.log(
      `[Pricing] Found ${bookings.length} overlapping bookings for car ${carId}`
    );

    // Calculate total booked days
    let totalBookedDays = 0;

    bookings.forEach((booking) => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);

      // Clamp dates to current month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      const clampedStart = startDate < monthStart ? monthStart : startDate;
      const clampedEnd = endDate > monthEnd ? monthEnd : endDate;

      // Count days between start and end (inclusive)
      const days =
        Math.ceil((clampedEnd - clampedStart) / (1000 * 60 * 60 * 24)) + 1;
      totalBookedDays += days;

      console.log(
        `[Pricing] Booking ${booking.status}: ${booking.start_date} to ${booking.end_date} = ${days} days (car ${carId})`
      );
    });

    const occupancyRate = totalBookedDays / daysInMonth;

    console.log(
      `[Pricing] Car ${carId}: ${totalBookedDays}/${daysInMonth} days booked (${Math.round(
        occupancyRate * 100
      )}%)`
    );

    return {
      bookedDays: totalBookedDays,
      occupancyRate: occupancyRate,
      daysInMonth,
    };
  } catch (err) {
    console.error("Error calculating occupancy rate:", err);
    return { bookedDays: 0, occupancyRate: 0, daysInMonth: 31 };
  }
};

/**
 * Calculate dynamic price for a car based on occupancy
 */
const getDynamicPrice = async (basePrice, carId) => {
  try {
    const occupancyData = await getMonthlyOccupancyRate(carId);
    const occupancyRate = occupancyData.occupancyRate;
    const multiplier = calculatePriceMultiplier(occupancyRate);
    const dynamicPrice = basePrice * multiplier;

    // Determine demand level
    let demandLevel;
    if (occupancyRate <= 0.1) demandLevel = "low";
    else if (occupancyRate <= 0.25) demandLevel = "medium";
    else if (occupancyRate <= 0.4) demandLevel = "high";
    else if (occupancyRate <= 0.6) demandLevel = "very-high";
    else demandLevel = "extreme";

    return {
      basePrice,
      dynamicPrice: Math.round(dynamicPrice * 100) / 100,
      multiplier: Math.round(multiplier * 100) / 100,
      bookedDays: occupancyData.bookedDays,
      totalDays: occupancyData.daysInMonth,
      occupancyPercentage: Math.round(occupancyRate * 100),
      availableDays: occupancyData.daysInMonth - occupancyData.bookedDays,
      demandLevel,
    };
  } catch (err) {
    console.error("Error calculating dynamic price:", err);
    return {
      basePrice,
      dynamicPrice: basePrice,
      multiplier: 1.0,
      bookedDays: 0,
      totalDays: 31,
      occupancyPercentage: 0,
      availableDays: 31,
      demandLevel: "low",
    };
  }
};

module.exports = {
  calculatePriceMultiplier,
  getMonthlyOccupancyRate,
  getDynamicPrice,
};
