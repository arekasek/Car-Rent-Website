const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, bookingId, amount, paymentMethod, stripeId } = req.body;

    if (!userId || !bookingId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .insert([
        {
          user_id: userId,
          booking_id: bookingId,
          amount,
          payment_method: paymentMethod || "credit_card",
          stripe_id: stripeId || null,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(payment);
  } catch (err) {
    console.error("Error creating payment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(payments || []);
  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
