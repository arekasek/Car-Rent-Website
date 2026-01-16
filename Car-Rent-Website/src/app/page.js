import Carousel from "../components/common/Carousel";
import Sidebar from "@/components/layout/Sidebar";

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
