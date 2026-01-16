"use client";

import React, { useState, useEffect, useRef } from "react";
import { MdOutlinePassword } from "react-icons/md";
import { FaArrowRightLong, FaArrowLeft } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import { validateField } from "@/lib/validators";

function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const validatedToken = useRef(false);

  useEffect(() => {
    const extractToken = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.substring(1);
        console.log("URL Hash:", hash);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        console.log("Access Token extracted:", accessToken ? "YES" : "NO");

        if (accessToken) {
          console.log("Token found, setting state");
          setToken(accessToken);
        } else {
          console.log("Token NOT found");
          setError("Invalid or missing reset link");
        }
      }
      setValidatingToken(false);
    };

    extractToken();
    validatedToken.current = true;
  }, []);

  const handleResetPassword = async () => {
    const passwordValidation = validateField("password", password);
    const confirmValidation = validateField("password", confirmPassword);

    const newErrors = {};

    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error;
    }

    if (!confirmValidation.valid) {
      newErrors.confirmPassword = confirmValidation.error;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError("Please fix all errors before submitting");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to reset password. The link may have expired."
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans w-full max-w-4xl">
          <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-3xl font-semibold text-center text-gray-800">
                Loading...
              </h2>
              <p className="text-gray-500 text-center text-base">
                Validating reset link
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans w-full max-w-4xl">
          <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
            <div className="flex flex-col gap-2 items-center">
              <MdError className="text-6xl text-red-600 mb-4" />
              <h2 className="text-3xl font-semibold text-center text-gray-800">
                Invalid Link
              </h2>
              <p className="text-gray-500 text-center text-base">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full mt-6 bg-black text-white py-2 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2 transition duration-300"
            >
              <FaArrowLeft />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans w-full max-w-4xl">
          <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
            <div className="sm:w-[80%] w-full h-full flex flex-col gap-6 items-center justify-center">
              <MdCheckCircle className="text-6xl text-green-600 mb-4" />
              <div className="flex flex-col gap-2 items-center">
                <h2 className="text-3xl font-semibold text-center text-gray-800">
                  Password Reset
                </h2>
                <p className="text-gray-500 text-center text-base">
                  Your password has been successfully reset. Redirecting to
                  login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[800px] px-4">
      <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans w-full max-w-2xl">
        <div className="w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
          <div className="sm:w-[80%] w-full h-full flex flex-col gap-6 items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-4xl font-semibold text-center text-gray-800">
                Create New Password
              </h2>
              <p className="text-gray-500 text-center text-sm">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="w-full bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                <MdError className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative w-full">
              <MdOutlinePassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    const validation = validateField(
                      "password",
                      e.target.value
                    );
                    if (validation.valid) {
                      setFieldErrors((prev) => {
                        const { password, ...rest } = prev;
                        return rest;
                      });
                    }
                  }
                }}
                className={`w-full pl-10 pr-3 py-2 border rounded-md transition ${
                  fieldErrors.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-slate-200/10"
                }`}
              />
              {fieldErrors.password && (
                <MdError className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              )}
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-600 w-full text-left">
                {fieldErrors.password}
              </p>
            )}

            <div className="relative w-full">
              <MdOutlinePassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    const validation = validateField(
                      "password",
                      e.target.value
                    );
                    if (validation.valid && password === e.target.value) {
                      setFieldErrors((prev) => {
                        const { confirmPassword, ...rest } = prev;
                        return rest;
                      });
                    }
                  }
                }}
                className={`w-full pl-10 pr-3 py-2 border rounded-md transition ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-slate-200/10"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <MdError className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              )}
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-600 w-full text-left">
                {fieldErrors.confirmPassword}
              </p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2 transition duration-300 group"
            >
              {loading ? (
                <>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  Reset Password
                  <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-3" />
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center gap-2 transition duration-300"
            >
              <FaArrowLeft />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
