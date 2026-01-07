"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";

export default function ShoppingCartModal({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } =
    useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  if (!user) {
    return (
      <div
        className="fixed inset-0 glass-effect-container z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg w-full max-w-md p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <ImCross
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
          />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your shopping cart and complete purchases.
          </p>
          <Link href="/login">
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 glass-effect-container z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <ImCross className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Your cart is empty</p>
              <Link
                href="/offer"
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-4 border rounded-lg p-4 items-center"
                >
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.imagefront}
                      alt={item.brand}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold">
                      {item.brand} {item.model}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ${item.currentPrice || item.data?.price || 0}/day
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {item.rentalDays} days
                    </p>
                  </div>

                  <div className="text-right w-20">
                    <p className="font-bold">
                      $
                      {(
                        (item.currentPrice || item.data?.price || 0) *
                        item.rentalDays
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
