"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-gray-200 flex items-center justify-center pt-8">
      <div className="bg-white rounded-lg p-8 sm:p-12 shadow-lg text-center max-w-md">
        <AiOutlineCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Your payment has been processed successfully.
        </p>
        <p className="text-gray-600 mb-8">
          Check your email for booking details and confirmation.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/offer")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
