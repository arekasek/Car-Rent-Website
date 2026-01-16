"use client";

import React, { useState } from "react";
import LoginCard from "@/components/auth/LoginCard";
import ForgotPasswordCard from "@/components/auth/ForgotPasswordCard";

function page() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="sm:h-[90vh] h-full w-full flex items-center justify-center ">
      {showForgotPassword ? (
        <ForgotPasswordCard onBack={() => setShowForgotPassword(false)} />
      ) : (
        <LoginCard onForgotPassword={() => setShowForgotPassword(true)} />
      )}
    </div>
  );
}

export default page;
