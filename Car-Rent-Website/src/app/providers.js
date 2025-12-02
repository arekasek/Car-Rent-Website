"use client";

import { GeistProvider } from "@geist-ui/react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export function Providers({ children }) {
  return (
    <GeistProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </GeistProvider>
  );
}
