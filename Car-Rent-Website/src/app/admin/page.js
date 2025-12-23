"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminDashboard from "@/components/common/AdminComp/AdminDashboard";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Admin page - Current user:", user);
    if (!user) {
      router.push("/login");
      return;
    }

    console.log("Admin page - User role:", user.role);
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  return <AdminDashboard />;
}
