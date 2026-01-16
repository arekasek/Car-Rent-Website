const z = require("zod");

const bookingSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  carId: z.string().uuid("Invalid car ID"),
  startDate: z.string().datetime("Invalid start date format"),
  endDate: z.string().datetime("Invalid end date format"),
  totalPrice: z.number().positive("Total price must be positive"),
});

const carSchema = z.object({
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  price: z.number().positive("Price must be positive"),
  available: z.boolean().optional(),
  mileage: z.number().nonnegative().optional(),
});

const paymentSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(["card", "bank_transfer", "wallet"]),
  status: z.enum(["pending", "completed", "failed"]).optional(),
});

const authSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });

        return res.status(422).json({
          error: "Validation failed",
          details: fieldErrors,
        });
      }

      return res.status(400).json({ error: "Invalid request body" });
    }
  };
}

module.exports = {
  bookingSchema,
  carSchema,
  paymentSchema,
  authSchema,
  validateRequest,
};
