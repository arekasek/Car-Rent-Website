import Image from "next/image";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
export default function Home() {
  return (
    <div className="w-full h-full bg-[#e5e6eb] ">
      <Navbar />
      <Carousel />
    </div>
  );
}
