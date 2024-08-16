"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from "./Ham-menu";
import { FaShoppingBasket } from "react-icons/fa";
import { Turn as Hamburger } from "hamburger-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            />
          </div>
          <div className="menu hidden sm:flex">
            <div className="flex flex-row 2xl:gap-32 xl:gap-32 lg:gap-10 md:gap-8 sm:gap-4 gap-4 items-center">
              <Link href="/menu">Home</Link>
              <Link href="/menu">Offer</Link>
              <Link href="/menu">Contact</Link>
              <Link href="/menu">About us</Link>
            </div>
          </div>
          <div className="user flex items-center">
            <div className="hidden sm:block">
              <FaShoppingBasket className="text-3xl" />
            </div>
            <div className="block sm:hidden z-50">
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
