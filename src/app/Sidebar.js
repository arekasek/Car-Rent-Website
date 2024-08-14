import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
export default function Sidebar() {
  return (
    <>
      <div className="absolute bottom-0 right-0 z-50">
        <div className="flex flex-col text-3xl gap-4 p-8 text-[#4D4D4D]">
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
    </>
  );
}
