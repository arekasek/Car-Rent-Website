import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "./img/car-logo.png";
import { FaShoppingBasket } from "react-icons/fa";
export default function Navbar() {
  return (
    <>
      <div className="w-full flex justify-center items-center font-sans text-black font-light fixed z-10">
        <div className="w-5/6 flex flex-row justify-between items-center">
          <div className="logo flex items-center">
            <Image src={logo} alt="logo" width={100} height={100} />
          </div>
          <div className="menu">
            <div className="flex flex-row gap-32 items-center">
              <Link href="/menu">Home</Link>
              <Link href="/menu">Offer</Link>
              <Link href="/menu">Contact</Link>
              <Link href="/menu">About us</Link>
            </div>
          </div>
          <div className="user flex items-center">
            <FaShoppingBasket className="text-3xl" />
          </div>
        </div>
      </div>
    </>
  );
}
