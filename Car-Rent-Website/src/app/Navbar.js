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
import ShoppingCartModal from "@/app/components/ShoppingCartModal";
import gsap from "gsap";
import "./fonts/vibes-font.css";
import "./fonts/thunder-font.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === "/";
  const { cartItems } = useCart();
  const { user } = useAuth();

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
        } w-full flex justify-center items-center font-sans text-black font-light z-50 min-h-[60px]`}
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

          <div className="user flex items-center flex-row-reverse gap-6">
            <div className="hidden sm:block">
              <button
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    setIsCartOpen(true);
                  }
                }}
                className="relative text-3xl"
                title={user ? "Shopping cart" : "Login to use cart"}
              >
                <PiShoppingCartThin id="animate-icon" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:block">
              {user ? (
                <button
                  onClick={() => router.push("/profile")}
                  className="text-3xl"
                  id="animate-icon"
                >
                  <CiLogin />
                </button>
              ) : (
                <Link href="/login">
                  <CiLogin className="text-3xl" id="animate-icon"></CiLogin>
                </Link>
              )}
            </div>

            <div className="block sm:hidden z-50" id="animate-icon">
              <Hamburger
                direction="left"
                easing="ease-in"
                color={isMenuOpen ? "white" : "black"}
                size={35}
                toggled={isMenuOpen}
                toggle={toggleMenu}
              />
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
