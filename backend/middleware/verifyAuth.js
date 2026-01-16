const supabase = require("../config/supabase");

// Middleware to verify JWT token and attach user to request
async function verifyAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user role:", userError);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: userData?.role || "user",
    };

    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

function verifyOwnershipOrAdmin(resourceUserIdField = "user_id") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const resourceUserId = req.params.userId || req.body[resourceUserIdField];

    if (req.user.id !== resourceUserId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You don't have permission to access this resource" });
    }

    next();
  };
}

module.exports = { verifyAuth, verifyAdmin, verifyOwnershipOrAdmin };
