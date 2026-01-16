const supabase = require("../config/supabase");
const cache = require("./cache");

async function getDynamicPrice(
  basePrice,
  carId,
  startDate = null,
  endDate = null
) {
  try {
    // Check cache first
    const cacheKey = `price:${carId}:${startDate || "all"}:${endDate || "all"}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("car_id", carId)
      .eq("status", "confirmed");

    if (error) {
      console.error("Error fetching bookings:", error);
      return {
        basePrice,
        dynamicPrice: basePrice,
        multiplier: 1,
        bookedDays: 0,
        availableDays: 30,
        totalDays: 30,
        occupancyPercentage: 0,
        demandLevel: "low",
      };
    }

    let rangeStart, rangeEnd;

    if (startDate && endDate) {
      rangeStart = new Date(startDate);
      rangeEnd = new Date(endDate);
    } else {
      const today = new Date();
      rangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
      rangeEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const months = [];
    let currentDate = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth(),
      1
    );

    while (currentDate <= rangeEnd) {
      const monthKey = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth()
      ).padStart(2, "0")}`;
      if (!months.find((m) => m.key === monthKey)) {
        const monthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        months.push({
          key: monthKey,
          year: currentDate.getFullYear(),
          month: currentDate.getMonth(),
          start: monthStart,
          end: monthEnd,
        });
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    let totalMonthBookedDays = 0;
    let totalMonthDays = 0;

    months.forEach((monthInfo) => {
      const monthStart = monthInfo.start;
      const monthEnd = monthInfo.end;
      const daysInMonth = monthEnd.getDate();
      let monthBookedDays = 0;

      if (bookings && bookings.length > 0) {
        bookings.forEach((booking) => {
          const bookingStart = new Date(booking.start_date);
          const bookingEnd = new Date(booking.end_date);

          const overlapStart = new Date(
            Math.max(bookingStart.getTime(), monthStart.getTime())
          );
          const overlapEnd = new Date(
            Math.min(bookingEnd.getTime(), monthEnd.getTime())
          );

          if (overlapStart <= overlapEnd) {
            monthBookedDays += Math.ceil(
              (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)
            );
          }
        });
      }

      totalMonthBookedDays += monthBookedDays;
      totalMonthDays += daysInMonth;
    });

    const occupancyPercentage =
      totalMonthDays > 0 ? (totalMonthBookedDays / totalMonthDays) * 100 : 0;

    console.log(
      `[Pricing Debug] Car ID: ${carId}, Start: ${startDate || "none"}, End: ${
        endDate || "none"
      }`
    );
    console.log(
      `[Pricing Debug] Months: ${months.map((m) => m.key).join(", ")}`
    );
    console.log(
      `[Pricing Debug] Total Month Days: ${totalMonthDays}, Booked Days: ${totalMonthBookedDays}, Occupancy: ${occupancyPercentage.toFixed(
        2
      )}%`
    );

    const totalDays = Math.ceil(
      (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24)
    );
    const bookedDays = Math.ceil((totalDays * occupancyPercentage) / 100);
    const availableDays = totalDays - bookedDays;

    let multiplier = 1;
    let demandLevel = "low";

    if (occupancyPercentage >= 80) {
      multiplier = 1.5; // 50% increase
      demandLevel = "very-high";
    } else if (occupancyPercentage >= 60) {
      multiplier = 1.3; // 30% increase
      demandLevel = "high";
    } else if (occupancyPercentage >= 40) {
      multiplier = 1.1; // 10% increase
      demandLevel = "medium";
    } else if (occupancyPercentage >= 20) {
      multiplier = 0.95; // 5% discount
      demandLevel = "low";
    } else {
      multiplier = 0.85; // 15% discount
      demandLevel = "very-low";
    }

    const dynamicPrice = Math.round(basePrice * multiplier * 100) / 100;

    const result = {
      basePrice,
      dynamicPrice,
      multiplier,
      bookedDays,
      availableDays,
      totalDays,
      occupancyPercentage: Math.round(occupancyPercentage * 100) / 100,
      demandLevel,
    };

    cache.set(cacheKey, result, 300000);

    return result;
  } catch (error) {
    console.error("Error calculating dynamic price:", error);
    return {
      basePrice,
      dynamicPrice: basePrice,
      multiplier: 1,
      bookedDays: 0,
      availableDays: 30,
      totalDays: 30,
      occupancyPercentage: 0,
      demandLevel: "low",
    };
  }
}

module.exports = { getDynamicPrice };
