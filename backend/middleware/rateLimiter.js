const rateLimit = {};

function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const identifier = req.user?.id || req.ip;
    const now = Date.now();

    if (!rateLimit[identifier]) {
      rateLimit[identifier] = [];
    }

    rateLimit[identifier] = rateLimit[identifier].filter(
      (time) => now - time < windowMs
    );

    if (rateLimit[identifier].length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests, please try again later",
        retryAfter: Math.ceil(
          (rateLimit[identifier][0] + windowMs - now) / 1000
        ),
      });
    }

    rateLimit[identifier].push(now);

    if (Object.keys(rateLimit).length > 10000) {
      const oldest = Math.min(
        ...Object.values(rateLimit).map((arr) => Math.min(...arr))
      );
      Object.keys(rateLimit).forEach((key) => {
        if (rateLimit[key][0] < oldest - windowMs) {
          delete rateLimit[key];
        }
      });
    }

    next();
  };
}

module.exports = rateLimiter;
