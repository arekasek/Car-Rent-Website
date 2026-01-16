const express = require("express");
const supabase = require("../config/supabase");
const {
  verifyAuth,
  verifyAdmin,
  verifyOwnershipOrAdmin,
} = require("../middleware/verifyAuth");
const router = express.Router();

router.post("/", verifyAuth, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, stripeId } = req.body;
    const userId = req.user.id;

    console.log("Payment endpoint - req.user:", req.user);
    console.log("Payment request body:", {
      bookingId,
      amount,
      paymentMethod,
      stripeId,
    });

    if (!bookingId || !amount) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          bookingId: !bookingId ? "Booking ID is required" : undefined,
          amount: !amount ? "Amount is required" : undefined,
        },
      });
    }

    if (amount <= 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: { amount: "Amount must be positive" },
      });
    }

    const validMethods = ["card", "bank_transfer", "wallet"];
    if (paymentMethod && !validMethods.includes(paymentMethod)) {
      return res.status(422).json({
        error: "Validation failed",
        details: { paymentMethod: "Invalid payment method" },
      });
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, user_id, total_price")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user_id !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have permission to pay for this booking" });
    }

    if (Math.abs(amount - booking.total_price) > 0.01) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          amount: `Amount must match booking total: ${booking.total_price}`,
        },
      });
    }

    const { data: recentPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("user_id", userId)
      .gt("created_at", new Date(Date.now() - 5000).toISOString())
      .limit(1);

    if (recentPayment && recentPayment.length > 0) {
      return res.status(409).json({
        error: "Duplicate payment",
        message: "A payment for this booking was just processed",
      });
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .insert([
        {
          user_id: userId,
          booking_id: bookingId,
          amount,
          payment_method: paymentMethod || "card",
          stripe_id: stripeId || null,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to create payment" });
    }

    return res.status(201).json(payment);
  } catch (err) {
    console.error("Error creating payment:", err);
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

      const { data: payments, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: "Failed to fetch payments" });
      }

      return res.json(payments || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch payments" });
    }

    return res.json(payments || []);
  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to delete payment" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting payment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
