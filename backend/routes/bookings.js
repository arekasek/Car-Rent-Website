const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(bookings || []);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, carId, startDate, endDate, totalPrice } = req.body;

    if (!userId || !carId || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          car_id: carId,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice || 0,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(bookings || []);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, cars(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(404).json({ error: "Booking not found" });
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

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("car_id", carId)
      .eq("status", "confirmed");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    const bookedDates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(d.toISOString().split("T")[0]);
      }
    });

    return res.json({ bookedDates: [...new Set(bookedDates)] });
  } catch (err) {
    console.error("Error fetching booked dates:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(booking);
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
