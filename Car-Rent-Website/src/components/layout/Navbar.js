"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from "./Ham-menu";
import { CiLogin } from "react-icons/ci";
import { Turn as Hamburger } from "hamburger-react";
import { PiShoppingCartThin } from "react-icons/pi";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import ShoppingCartModal from "@/components/booking/ShoppingCartModal";
import { Loader } from "@/components/common/Loader";
import gsap from "gsap";
import "@/styles/vibes-font.css";
import "@/styles/thunder-font.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === "/";
  const { cartItems } = useCart();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    gsap.fromTo(
      "#logo",
      { opacity: 0, scale: 0.5, xPercent: -100 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", xPercent: 0 }
    );
    gsap.fromTo(
      "#animate-icon",
      { opacity: 0, scale: 0.5, xPercent: 100 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", xPercent: 0 }
    );
    gsap.fromTo(
      ".menu-link",
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.2,
        delay: 1,
      }
    );
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`${
          isMainPage
            ? "fixed top-0 left-0 right-0 h-[10vh]"
            : "relative h-[10vh] "
        } w-full flex justify-center items-center font-sans text-black font-light z-40 min-h-[60px]`}
      >
        <div className="w-full px-8 flex flex-row justify-between items-center">
          <div className="logo flex items-center">
            <Image
              src="/img/car-logo.png"
              alt="logo"
              width={100}
              height={100}
              id="logo"
            />
          </div>

          <div className="menu hidden sm:flex">
            <div className="flex flex-row 2xl:gap-32 xl:gap-32 lg:gap-10 md:gap-8 sm:gap-4 gap-4 items-center">
              <Link href="/" className="menu-link">
                Home
              </Link>
              <Link href="/offer" className="menu-link">
                Offer
              </Link>
              <Link href="/menu" className="menu-link">
                Contact
              </Link>
              <Link href="/menu" className="menu-link">
                About us
              </Link>
            </div>
          </div>

          <div
            className="flex flex-row-reverse gap-8 justify-center items-center"
            id="animate-icon"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:block"
            >
              <PiShoppingCartThin className="text-3xl relative" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="menu-link font-semibold text-red-600 hidden sm:block"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                  className="hidden sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <CiLogin className="text-3xl" />
              </Link>
            )}
            <div className="sm:hidden block">
              <Hamburger toggled={isMenuOpen} toggle={toggleMenu} />
            </div>
          </div>
        </div>
      </div>

      <HamburgerMenu isOpen={isMenuOpen} closeMenu={closeMenu} />
      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
