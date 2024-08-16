import Image from "next/image";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import Sidebar from "./Sidebar";
import { MdArrowDropDown } from "react-icons/md";
import HamburgerMenu from "./Ham-menu";

export default function Home() {
  return (
    <>
      <div className="w-full h-full bg-[#e5e6eb] relative flex flex-col">
        <Navbar />
        <Carousel />
        <Sidebar />
        <HamburgerMenu />
      </div>
    </>
  );
}
