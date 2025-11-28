import Image from "next/image";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import Sidebar from "./Sidebar";
import { MdArrowDropDown } from "react-icons/md";
import HamburgerMenu from "./Ham-menu";

export default function Home() {
  return (
    <>
      <div className="w-full h-full relative flex flex-col">
        <Carousel />
        <Sidebar />
      </div>
    </>
  );
}
