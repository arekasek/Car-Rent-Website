"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from "./Ham-menu";
import { SlBasket } from "react-icons/sl";
import { Turn as Hamburger } from "hamburger-react";
import gsap from "gsap";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-center items-center font-sans text-black font-light fixed z-50">
        <div className="w-5/6 flex flex-row justify-between items-center">
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
              <Link href="/menu" className="menu-link">
                Home
              </Link>
              <Link href="/menu" className="menu-link">
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
          <div className="user flex items-center">
            <div className="hidden sm:block">
              <button>
                <SlBasket className="text-3xl" id="animate-icon" />
              </button>
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
    </>
  );
}
