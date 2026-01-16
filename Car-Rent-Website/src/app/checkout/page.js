"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@nextui-org/button";
import { FaArrowLeft } from "react-icons/fa";
import FormInput from "@/components/ui/FormInput";
import {
  validateCheckoutForm,
  validateField,
  formatCardNumber,
  formatExpiry,
  formatPhone,
} from "@/lib/validators";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Fallback: if session is null but user exists, try to get session from localStorage
  const sessionFallback =
    session ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("auth_session") || "null")
      : null);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[10vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[10vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before checking out
          </p>
          <Button
            onClick={() => router.push("/offer")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Cars
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[10vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to proceed with checkout
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!sessionFallback || !sessionFallback.access_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[10vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Session Error</h1>
          <p className="text-gray-600 mb-2">
            Your session is invalid or expired. Please log in again.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Debug: Session = {JSON.stringify(session)}
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.currentPrice || item.price || 0;
      return sum + price * item.rentalDays;
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "cardExpiry") {
      formattedValue = formatExpiry(value);
    } else if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    const validation = validateField(name, formattedValue);
    setFieldErrors((prev) => {
      if (validation.valid) {
        const { [name]: _, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [name]: validation.error,
        };
      }
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (loading) return;

    console.log("=== PAYMENT HANDLER START ===");
    console.log("Current session from context:", session);
    console.log("Current user from context:", user);
    console.log("Session access_token exists:", !!session?.access_token);

    const validation = validateCheckoutForm(formData);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      const bookingPromises = cartItems.map((item) => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const price = item.currentPrice || item.price || 0;
        const totalPrice = price * item.rentalDays;

        const bookingData = {
          carId: item.id,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          totalPrice: totalPrice,
        };
        console.log("Creating booking with data:", bookingData);

        return fetch(`${backendUrl}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionFallback.access_token}`,
          },
          body: JSON.stringify(bookingData),
        });
      });

      const responses = await Promise.all(bookingPromises);
      const bookingIds = [];

      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Booking ${i} creation failed. Status: ${response.status}. Response:`,
            errorText
          );
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.error || `Failed to create booking: ${response.status}`
            );
          } catch {
            throw new Error(
              `Failed to create booking: ${errorText || response.statusText}`
            );
          }
        }
        const bookingData = await response.json();
        bookingIds.push(bookingData.id);
      }

      const paymentPromises = bookingIds.map((bookingId) => {
        const bookingIndex = bookingIds.indexOf(bookingId);
        const item = cartItems[bookingIndex];
        const price = item.currentPrice || item.price || 0;
        const bookingTotal = price * item.rentalDays;

        const paymentData = {
          userId: user.id,
          bookingId: bookingId,
          amount: bookingTotal,
          paymentMethod: "card",
          stripeId: `stripe_${Date.now()}_${bookingId}`,
        };

        console.log(
          "Creating payment with token:",
          sessionFallback.access_token
        );
        console.log("Payment data:", paymentData);

        return fetch(`${backendUrl}/api/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionFallback.access_token}`,
          },
          body: JSON.stringify(paymentData),
        });
      });

      const paymentResponses = await Promise.all(paymentPromises);

      for (let i = 0; i < paymentResponses.length; i++) {
        const response = paymentResponses[i];
        if (!response.ok) {
          const paymentErrorText = await response.text();
          console.error(
            "Payment processing failed. Status:",
            response.status,
            "Response:",
            paymentErrorText
          );
          try {
            const errorData = JSON.parse(paymentErrorText);
            throw new Error(errorData.error || "Payment processing failed");
          } catch {
            throw new Error(
              `Payment processing failed: ${
                paymentErrorText || response.statusText
              }`
            );
          }
        }
      }

      clearCart();
      router.push("/checkout/success");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-[10vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add some cars to your cart to proceed
          </p>
          <Button
            onClick={() => router.push("/offer")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 pb-8 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>
                <Button
                  onClick={() => {
                    clearCart();
                    router.push("/offer");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-b pb-6 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.brand} {item.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.rentalDays} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        $
                        {(
                          (item.currentPrice || item.price || 0) *
                          item.rentalDays
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.currentPrice || item.price || 0}/day
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Details
              </h2>

              <form onSubmit={handlePayment}>
                {error && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-semibold">Validation Error</p>
                      <p>{error}</p>
                      {error.includes("Start date cannot be in the past") && (
                        <div className="mt-3 bg-red-100 p-3 rounded border border-red-300">
                          <p className="text-sm font-semibold mb-2">
                            Your cart has items with past dates.
                          </p>
                          <p className="text-sm mb-3">
                            You need to go back, clear your cart, and select new
                            rental dates in the future.
                          </p>
                          <Button
                            onClick={() => {
                              clearCart();
                              router.push("/offer");
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Clear Cart & Browse Cars
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={fieldErrors.fullName}
                    required
                    autoComplete="name"
                  />

                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={fieldErrors.email}
                    required
                    autoComplete="email"
                  />

                  <FormInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="123-456-789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={fieldErrors.phone}
                    required
                    autoComplete="tel"
                    className="md:col-span-2"
                  />

                  <FormInput
                    label="Cardholder Name"
                    name="cardName"
                    type="text"
                    placeholder="JOHN DOE"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    error={fieldErrors.cardName}
                    required
                    autoComplete="cc-name"
                    className="md:col-span-2"
                  />

                  <FormInput
                    label="Card Number"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    error={fieldErrors.cardNumber}
                    required
                    autoComplete="cc-number"
                    maxLength="19"
                    className="md:col-span-2"
                  />

                  <FormInput
                    label="Expiry Date"
                    name="cardExpiry"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    error={fieldErrors.cardExpiry}
                    required
                    autoComplete="cc-exp"
                    maxLength="5"
                  />

                  <FormInput
                    label="CVC"
                    name="cardCVC"
                    type="text"
                    placeholder="123"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    error={fieldErrors.cardCVC}
                    required
                    autoComplete="cc-csc"
                    maxLength="4"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || Object.keys(fieldErrors).length > 0}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Processing..." : "Complete Payment"}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-[calc(10vh+2rem)]">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Price Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">
                    ${(calculateTotal() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-blue-50 p-3 rounded">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${(calculateTotal() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Secure payment processing</p>
                <p>✓ 24/7 customer support</p>
                <p>✓ Free cancellation up to 24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
