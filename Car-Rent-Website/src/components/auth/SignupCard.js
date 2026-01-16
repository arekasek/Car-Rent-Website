"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/common/Loader";
import { validateAuthForm, validateField } from "@/lib/validators";

import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdError } from "react-icons/md";

export default function SignupCard({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async () => {
    const validation = validateAuthForm({ email, password });
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
      const response = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      if (data.data?.user && data.data?.session) {
        localStorage.setItem("auth_user", JSON.stringify(data.data.user));
        localStorage.setItem("auth_session", JSON.stringify(data.data.session));
      }

      setError(null);
      if (typeof onSuccess === "function") onSuccess(data);

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Signup error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row login-box-shadow rounded-lg font-sans">
      <div className="w-[30vw] h-[50vh] flex flex-col items-center justify-center gap-6 p-8">
        <div className="w-[80%] h-full flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-5xl font-semibold text-center text-gray-800">
              Create account
            </h2>
            <p className="text-gray-500 text-center text-base">
              Sign up to get started
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
              placeholder="Email"
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

          <div className="relative w-full">
            <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  const validation = validateField("password", e.target.value);
                  if (validation.valid) {
                    setFieldErrors((prev) => {
                      const { password, ...rest } = prev;
                      return rest;
                    });
                  }
                }
              }}
              className={`w-full p-2 pl-10 pr-3 py-2 border rounded-md transition ${
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

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition duration-300 group"
          >
            {loading ? (
              <>
                <Loader message="Signing up..." />
              </>
            ) : (
              <>
                Sign up
                <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-3" />
              </>
            )}
          </button>

          <p className="text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative w-[25vw] h-[50vh]">
        <Image
          src="/img/Ferrari-login.png"
          alt="car image"
          fill
          className="object-cover filter brightness-90 saturate-100 contrast-50 hover:contrast-100 transition duration-1000 rounded-r-lg"
        />
      </div>
    </div>
  );
}
