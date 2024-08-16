import React from "react";
import Link from "next/link";

// Importing icons
import { FaHome } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { IoMdContacts } from "react-icons/io";
import { FaCarOn } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

export default function HamburgerMenu({ isOpen, closeMenu }) {
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 right-0 z-20 bg-[#000000] h-full w-[100vw] text-white sm:hidden block opacity-80">
          <div className="flex flex-col text-4xl gap-8 p-8 text-[#fff] items-center justify-between mt-[100px] h-[80vh]">
            <div className="flex flex-col gap-6 font-sans">
              <Link href="/menu" onClick={closeMenu}>
                <div className="flex flex-row items-center gap-4">
                  <FaHome />
                  <span>Home</span>
                </div>
              </Link>
              <Link href="/menu" onClick={closeMenu}>
                <div className="flex flex-row items-center gap-4">
                  <BiSolidOffer />
                  <span>Offer</span>
                </div>
              </Link>
              <Link href="/menu" onClick={closeMenu}>
                <div className="flex flex-row items-center gap-4">
                  <IoMdContacts />
                  <span>Contact</span>
                </div>
              </Link>
              <Link href="/menu" onClick={closeMenu}>
                <div className="flex flex-row items-center gap-4">
                  <FaCarOn />
                  <span>About us</span>
                </div>
              </Link>
            </div>
            <div className="flex flex-row text-4xl gap-4 p-8 ">
              <button>
                <FaFacebook />
              </button>
              <button>
                <FaInstagramSquare />
              </button>
              <button>
                <FaLinkedin />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
