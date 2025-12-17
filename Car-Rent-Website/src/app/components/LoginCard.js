"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ICONS
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";

function LoginCard({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      console.log("Login response data:", data);
      if (data.data?.user) {
        console.log("Saving user to localStorage:", data.data.user);
        localStorage.setItem("auth_user", JSON.stringify(data.data.user));
      } else {
        console.warn("No user data in response:", data);
      }

      alert("Zalogowano!");
      if (typeof onSuccess === "function") onSuccess(data);

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col login-box-shadow rounded-lg font-sans mt-10 w-full sm:w-auto">
      <div className="sm:w-[30vw] w-full sm:h-[50vh] h-auto flex flex-col items-center justify-center gap-6 p-8">
        <div className="sm:w-[80%] w-full h-full flex flex-col gap-6 items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-5xl font-semibold text-center text-gray-800">
              Welcome back.
            </h2>
            <p className="text-gray-500 text-center text-base">
              Sign in to access your account
            </p>
          </div>

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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-slate-200/10"
            />
          </div>

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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-slate-200/10"
            />
          </div>

          <div className="w-full">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-500">
              Remember me
            </label>

            <a href="#" className="float-right text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2 transition duration-300 group"
          >
            {loading ? "Logging in..." : "Login"}
            <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-3" />
          </button>

          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
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

export default LoginCard;
