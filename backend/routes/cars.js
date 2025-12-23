const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error("Error fetching cars:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(404).json({ error: "Car not found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Error fetching car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { brand, model, color, imagefront, price, data } = req.body;

    if (!brand || !model || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: insertedCar, error } = await supabase
      .from("cars")
      .insert([{ brand, model, color, imagefront, price, data }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(insertedCar);
  } catch (err) {
    console.error("Error creating car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, color, imagefront, price, data } = req.body;

    const { data: updatedCar, error } = await supabase
      .from("cars")
      .update({ brand, model, color, imagefront, price, data })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json(updatedCar);
  } catch (err) {
    console.error("Error updating car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Car deleted successfully" });
  } catch (err) {
    console.error("Error deleting car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
