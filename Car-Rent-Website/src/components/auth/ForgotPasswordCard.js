"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MdOutlineMailLock } from "react-icons/md";
import { FaArrowRightLong, FaArrowLeft } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { validateField } from "@/lib/validators";

function ForgotPasswordCard({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async () => {
    const validation = validateField("email", email);
    if (!validation.valid) {
      setFieldErrors({ email: validation.error });
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans mt-10 w-full sm:w-auto">
        <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
          <div className="sm:w-[80%] w-full h-full flex flex-col gap-6 items-center justify-center">
            <MdCheckCircle className="text-6xl text-green-600 mb-4" />
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-3xl font-semibold text-center text-gray-800">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-center text-base">
                We've sent a password reset link to your email. Check your inbox
                and follow the instructions to reset your password.
              </p>
            </div>

            <button
              onClick={onBack}
              className="w-full mt-6 bg-black text-white py-2 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 transition duration-300"
            >
              <FaArrowLeft />
              Back to Login
            </button>
          </div>
        </div>

        <div className="relative sm:w-[25vw] w-full h-[50vh]">
          <Image
            src="/img/Ferrari-login.png"
            alt="car image"
            fill
            className="object-cover filter brightness-90 saturate-100 contrast-50 hover:contrast-100 transition duration-1000 rounded-t-2xl sm:rounded-r-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans mt-10 w-full sm:w-auto">
      <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
        <div className="sm:w-[80%] w-full h-full flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-5xl font-semibold text-center text-gray-800">
              Reset Password
            </h2>
            <p className="text-gray-500 text-center text-base">
              Enter your email to receive a reset link
            </p>
          </div>

          {error && (
            <div className="w-full bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
              <MdError className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative w-full">
            <MdOutlineMailLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  const validation = validateField("email", e.target.value);
                  if (validation.valid) {
                    setFieldErrors((prev) => {
                      const { email, ...rest } = prev;
                      return rest;
                    });
                  }
                }
              }}
              className={`w-full pl-10 pr-3 py-2 border rounded-md transition ${
                fieldErrors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-slate-200/10"
              }`}
            />
            {fieldErrors.email && (
              <MdError className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            )}
          </div>
          {fieldErrors.email && (
            <p className="text-sm text-red-600 w-full text-left">
              {fieldErrors.email}
            </p>
          )}

          <button
            onClick={handleResetRequest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition duration-300 group"
          >
            {loading ? (
              <>
                <span>Sending...</span>
              </>
            ) : (
              <>
                Send Reset Link
                <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-3" />
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center gap-2 transition duration-300"
          >
            <FaArrowLeft />
            Back to Login
          </button>
        </div>
      </div>

      <div className="relative sm:w-[25vw] w-full h-[50vh]">
        <Image
          src="/img/Ferrari-login.png"
          alt="car image"
          fill
          className="object-cover filter brightness-90 saturate-100 contrast-50 hover:contrast-100 transition duration-1000 rounded-t-2xl sm:rounded-r-lg"
        />
      </div>
    </div>
  );
}

export default ForgotPasswordCard;
