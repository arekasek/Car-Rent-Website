const express = require("express");
const supabase = require("../config/supabase");
const {
  verifyAuth,
  verifyAdmin,
  verifyOwnershipOrAdmin,
} = require("../middleware/verifyAuth");
const cache = require("../utils/cache");
const router = express.Router();

function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }

  if (start >= end) {
    return { valid: false, error: "Start date must be before end date" };
  }

  if (start < now) {
    return { valid: false, error: "Start date cannot be in the past" };
  }

  return { valid: true };
}

async function checkBookingConflicts(
  carId,
  startDate,
  endDate,
  excludeId = null
) {
  const { data: conflicts, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("car_id", carId)
    .eq("status", "confirmed")
    .lt("end_date", endDate)
    .gt("start_date", startDate);

  if (error) {
    throw error;
  }

  if (excludeId) {
    return conflicts.filter((c) => c.id !== excludeId).length > 0;
  }

  return conflicts.length > 0;
}

router.get("/", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    return res.json(bookings || []);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", verifyAuth, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;
    const userId = req.user.id;

    if (!carId || !startDate || !endDate) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          carId: !carId ? "Car ID is required" : undefined,
          startDate: !startDate ? "Start date is required" : undefined,
          endDate: !endDate ? "End date is required" : undefined,
        },
      });
    }

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(422).json({
        error: "Validation failed",
        details: { dates: dateValidation.error },
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: { totalPrice: "Total price must be positive" },
      });
    }

    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("id")
      .eq("id", carId)
      .single();

    if (carError || !car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const hasConflict = await checkBookingConflicts(carId, startDate, endDate);
    if (hasConflict) {
      return res.status(409).json({
        error: "Booking conflict",
        message: "This car is already booked for the selected dates",
      });
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          car_id: carId,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to create booking" });
    }

    cache.clearPattern(`price:${carId}:.*`);
    cache.clearPattern(`booked-dates:${carId}`);

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/user/:userId",
  verifyAuth,
  verifyOwnershipOrAdmin("userId"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, cars(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: "Failed to fetch bookings" });
      }

      return res.json(bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Booking not found" });
      }
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch booking" });
    }

    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have permission to access this booking" });
    }

    return res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/car/:carId/booked-dates", async (req, res) => {
  try {
    const { carId } = req.params;

    const cacheKey = `booked-dates:${carId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("car_id", carId)
      .eq("status", "confirmed");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch booked dates" });
    }

    const bookedDates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(d.toISOString().split("T")[0]);
      }
    });

    const result = { bookedDates: [...new Set(bookedDates)] };

    cache.set(cacheKey, result, 300000);
    res.set("X-Cache", "MISS");

    return res.json(result);
  } catch (err) {
    console.error("Error fetching booked dates:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have permission to modify this booking" });
    }

    if (startDate || endDate) {
      const newStart = startDate || booking.start_date;
      const newEnd = endDate || booking.end_date;

      const dateValidation = validateDateRange(newStart, newEnd);
      if (!dateValidation.valid) {
        return res.status(422).json({
          error: "Validation failed",
          details: { dates: dateValidation.error },
        });
      }

      const hasConflict = await checkBookingConflicts(
        booking.car_id,
        newStart,
        newEnd,
        id
      );
      if (hasConflict) {
        return res.status(409).json({
          error: "Booking conflict",
          message: "The new dates conflict with an existing booking",
        });
      }
    }

    const { data: updated, error } = await supabase
      .from("bookings")
      .update({
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to update booking" });
    }

    cache.clearPattern(`booked-dates:${booking.car_id}`);
    cache.clearPattern(`price:${booking.car_id}:.*`);

    return res.json(updated);
  } catch (err) {
    console.error("Error updating booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/cancel", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have permission to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(409).json({ error: "Booking is already cancelled" });
    }

    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to cancel booking" });
    }

    cache.clearPattern(`booked-dates:${booking.car_id}`);
    cache.clearPattern(`price:${booking.car_id}:.*`);

    return res.json(updated);
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("car_id")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to delete booking" });
    }

    cache.clearPattern(`booked-dates:${booking.car_id}`);
    cache.clearPattern(`price:${booking.car_id}:.*`);

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
