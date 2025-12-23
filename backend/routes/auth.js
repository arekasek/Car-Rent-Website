const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

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
        console.warn(
          "Could not fetch user role - users table may not exist or user not found:",
          profileError.message
        );
      } else if (userProfile && userProfile.role) {
        userData.role = userProfile.role;
        console.log(`User logged in with role: ${userData.role}`);
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
    return res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user) {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          role: "user",
        },
      ]);
    }

    return res.json({
      data: {
        user: data.user,
        session: data.session,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
