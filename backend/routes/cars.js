const express = require("express");
const supabase = require("../config/supabase");
const { getDynamicPrice } = require("../utils/dynamicPricing");
const { verifyAuth, verifyAdmin } = require("../middleware/verifyAuth");
const cache = require("../utils/cache");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const cacheKey = `cars:all:${limit}:${offset}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const { data, error, count } = await supabase
      .from("cars")
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch cars" });
    }

    const carsWithDynamicPricing = await Promise.all(
      (data || []).map(async (car) => {
        const pricing = await getDynamicPrice(car.price, car.id);
        return {
          ...car,
          basePrice: pricing.basePrice,
          currentPrice: pricing.dynamicPrice,
          priceMultiplier: pricing.multiplier,
          bookedDays: pricing.bookedDays,
          availableDays: pricing.availableDays,
          totalDays: pricing.totalDays,
          occupancyPercentage: pricing.occupancyPercentage,
          demandLevel: pricing.demandLevel,
        };
      })
    );

    const result = {
      data: carsWithDynamicPricing,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < count,
      },
    };

    cache.set(cacheKey, result, 300000);
    res.set("X-Cache", "MISS");

    return res.json(result);
  } catch (err) {
    console.error("Error fetching cars:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `car:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Car not found" });
      }
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch car" });
    }

    const pricing = await getDynamicPrice(data.price, data.id);
    const carWithPricing = {
      ...data,
      basePrice: pricing.basePrice,
      currentPrice: pricing.dynamicPrice,
      priceMultiplier: pricing.multiplier,
      bookedDays: pricing.bookedDays,
      availableDays: pricing.availableDays,
      totalDays: pricing.totalDays,
      occupancyPercentage: pricing.occupancyPercentage,
      demandLevel: pricing.demandLevel,
    };

    cache.set(cacheKey, carWithPricing, 300000);
    res.set("X-Cache", "MISS");

    return res.json(carWithPricing);
  } catch (err) {
    console.error("Error fetching car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/pricing", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          startDate: !startDate ? "startDate is required" : undefined,
          endDate: !endDate ? "endDate is required" : undefined,
        },
      });
    }

    const { data, error } = await supabase
      .from("cars")
      .select("price")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Car not found" });
      }
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch car" });
    }

    const pricing = await getDynamicPrice(data.price, id, startDate, endDate);

    return res.json(pricing);
  } catch (err) {
    console.error("Error fetching pricing:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { brand, model, color, imagefront, price, data } = req.body;

    if (!brand || !model || !price) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          brand: !brand ? "Brand is required" : undefined,
          model: !model ? "Model is required" : undefined,
          price: !price ? "Price is required" : undefined,
        },
      });
    }

    if (price <= 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: { price: "Price must be positive" },
      });
    }

    const { data: insertedCar, error } = await supabase
      .from("cars")
      .insert([{ brand, model, color, imagefront, price, data }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to create car" });
    }

    cache.clearPattern("cars:.*");

    return res.status(201).json(insertedCar);
  } catch (err) {
    console.error("Error creating car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, color, imagefront, price, data } = req.body;

    const { data: existing, error: existError } = await supabase
      .from("cars")
      .select("id")
      .eq("id", id)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (price !== undefined && price <= 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: { price: "Price must be positive" },
      });
    }

    const updateData = {};
    if (brand !== undefined) updateData.brand = brand;
    if (model !== undefined) updateData.model = model;
    if (color !== undefined) updateData.color = color;
    if (imagefront !== undefined) updateData.imagefront = imagefront;
    if (price !== undefined) updateData.price = price;
    if (data !== undefined) updateData.data = data;

    const { data: updatedCar, error } = await supabase
      .from("cars")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to update car" });
    }

    cache.clearPattern("cars:.*");
    cache.delete(`car:${id}`);

    return res.json(updatedCar);
  } catch (err) {
    console.error("Error updating car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing, error: existError } = await supabase
      .from("cars")
      .select("id")
      .eq("id", id)
      .single();

    if (existError || !existing) {
      return res.status(404).json({ error: "Car not found" });
    }

    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to delete car" });
    }

    cache.clearPattern("cars:.*");
    cache.delete(`car:${id}`);

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting car:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
