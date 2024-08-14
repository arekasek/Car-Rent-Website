"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./fonts/menu-font.css";
import "./fonts/thunder-font.css";
import "./fonts/vibes-font.css";
import { ImCross } from "react-icons/im";
import { Button } from "@nextui-org/button";
import { Scrollbars } from "rc-scrollbars";

export default function Carousel() {
  const [cars, setCars] = useState([]);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    fetch("https://car-rent-website.onrender.com/api/cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 8000,
  };

  const handleDetailsClick = (car) => {
    setSelectedCar(car);
    setIsDetailsVisible(true);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDetails();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full h-[75vh]">
        <Slider {...settings} className="w-full h-full">
          {cars.map((car, index) => (
            <div
              key={index}
              className={`w-full h-[75vh] relative ${car.model.toLowerCase()}`}
            >
              <h1
                className="opacity-80 top-[calc(50%-20px)] 2xl:top-[calc(50%-100px)] xl:top-[calc(50%-80px)] lg:top-[calc(50%-60px)] md:top-[calc(50%-40px)] sm:top-[calc(50%-20px)] 2xl:text-[15vw] xl:text-[15rem] lg:text-[12rem] md:text-[10rem] sm:text-[8rem] text-[20vw] scale-x-125 scale-y-[1.5]  text-[#000000] absolute thunder left-1/2 transform -translate-y-1/2 -translate-x-1/2 -z-10 text-wrap text-center text-transparent "
                style={{
                  backgroundImage: `linear-gradient(to bottom, ${car.color}, rgba(255, 255, 255, 0) 75%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {car.model.toUpperCase()}
              </h1>

              <h1 className="text-[#000000] absolute vibes top-[25%] 2xl:top-[2%] xl:top-[8%] lg:top-[10%] md:top-[15%] sm:top-[20%] left-1/2 transform -translate-x-1/2 vibes -z-10 text-wrap text-center 2xl:text-[5vw] xl:text-[8vw] lg:text-[5vw] md:text-[7vw] sm:text-[5vw] text-[15vw]">
                {car.brand}
              </h1>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <Button
                  className="p-6 w-[250px] font-sans shadow-button text-xl text-white"
                  auto
                  style={{ backgroundColor: car.color }}
                  onClick={() => handleDetailsClick(car)}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {isDetailsVisible && (
        <div
          className="fixed h-full w-full flex justify-center items-center"
          onClick={handleOverlayClick}
        >
          <div
            className="relative w-3/5 p-8 inset-0 h-fit shadow-popup bg-[#e5e6eb] z-0 flex flex-col items-center justify-center transition-transform duration-700 ease-in-out transform"
            style={{
              transform: isDetailsVisible
                ? "translateY(0)"
                : "translateY(100%)",
            }}
          >
            <ImCross
              className="absolute -top-7 -right-7 p-2 rounded-full text-6xl text-black cursor-pointer"
              onClick={closeDetails}
            />

            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-full h-[30vh]">
                <img
                  src={selectedCar?.imageFront}
                  alt={selectedCar?.brand}
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-4xl font-bold mb-4">{selectedCar?.model}</h1>
              <p className="text-lg mb-8">{selectedCar?.brand}</p>

              <div className="w-full h-[20vh]">
                <Scrollbars className="w-full h-[20vh]" autoHide>
                  <table className="w-full text-left font-sans">
                    {selectedCar?.data &&
                      Object.entries(selectedCar.data).map(([key, value]) => (
                        <tr
                          className=" border-b-gray-300  odd:bg-[#c0c2ce]"
                          key={key}
                        >
                          <td className="text-left px-5 py-1">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </td>{" "}
                          <td className="text-right px-5 py-1">{value}</td>
                        </tr>
                      ))}
                  </table>
                </Scrollbars>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
