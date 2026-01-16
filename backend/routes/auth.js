const express = require("express");
const supabase = require("../config/supabase");
const { verifyAuth } = require("../middleware/verifyAuth");

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      return res.status(500).json({ error: "Authentication failed" });
    }

    console.log("Supabase signin response - data.session:", data.session);
    console.log("Supabase session keys:", Object.keys(data.session || {}));

    let userData = {
      ...data.user,
      role: "user",
    };

    try {
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.warn("Could not fetch user role:", profileError.message);
      } else if (userProfile && userProfile.role) {
        userData.role = userProfile.role;
      }
    } catch (err) {
      console.warn("Error fetching user role:", err.message);
    }

    return res.json({
      data: {
        user: userData,
        session: data.session,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        error: "Validation failed",
        details: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({
        error: "Validation failed",
        details: { email: "Invalid email format" },
      });
    }

    if (password.length < 6) {
      return res.status(422).json({
        error: "Validation failed",
        details: { password: "Password must be at least 6 characters" },
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return res.status(409).json({ error: "Email already registered" });
      }
      return res.status(500).json({ error: "Signup failed" });
    }

    if (data.user) {
      try {
        await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: "user",
          },
        ]);
      } catch (err) {
        console.error("Error creating user profile:", err);
      }
    }

    return res.status(201).json({
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", verifyAuth, async (req, res) => {
  try {
    // User is already verified by middleware
    const { data: userProfile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }

    return res.json({
      user: {
        ...req.user,
        ...userProfile,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
