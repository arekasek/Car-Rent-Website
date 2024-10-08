"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import gsap from "gsap";
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

  useEffect(() => {
    gsap.fromTo(
      ".slick-slide",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1.5, ease: "power2.out", stagger: 0.3 }
    );

    gsap.fromTo(
      "#car-model, #car-brand",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        delay: 0.5,
      }
    );
  }, [cars]);

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
                id="car-model"
              >
                {car.model.toUpperCase()}
              </h1>

              <h1
                id="car-brand"
                className="text-[#000000] absolute vibes top-[25%] 2xl:top-[2%] xl:top-[8%] lg:top-[10%] md:top-[15%] sm:top-[20%] left-1/2 transform -translate-x-1/2 vibes -z-10 text-wrap text-center 2xl:text-[5vw] xl:text-[8vw] lg:text-[5vw] md:text-[7vw] sm:text-[5vw] text-[15vw]"
              >
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
          className="fixed h-full w-full flex justify-center items-center glass-effect-container"
          onClick={handleOverlayClick}
        >
          <div
            className="relative rounded-lg 2xl:w-[35vw] xl:w-[40vw] lg:w-[50vw] md:w-[60vw] sm:w-[70vw] w-[90vw] p-8 inset-0 h-fit shadow-popup bg-[#e5e6eb] z-0 flex flex-col items-center justify-center transition-transform duration-700 ease-in-out transform"
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
            <div className="w-full flex flex-col justify-center items-center gap-6">
              <div className="relative w-full flex justify-center items-center -mt-[100px]">
                <img
                  src={selectedCar?.imageFront}
                  alt={selectedCar?.brand}
                  className="relative w-full h-[20vh] object-contain z-10"
                  style={{
                    marginTop: "-10px",
                  }}
                />
              </div>
              <div className="text-center flex flex-row gap-6 items-center">
                <h1 className="text-2xl text-black font-sans font-bold">
                  {selectedCar?.brand.toUpperCase()}
                </h1>
                <p className="text-4xl sm:text-6xl text-[#6e6e6e] font-bold vibes">
                  {selectedCar?.model}
                </p>
              </div>
              <div className="w-full sm:w-4/5 h-[20vh]">
                <Scrollbars className="w-full h-[20vh]">
                  <table className="w-full text-left font-sans md:text-lg text-sm">
                    {selectedCar?.data &&
                      Object.entries(selectedCar.data).map(([key, value]) => (
                        <tr
                          className=" border-b-gray-300  odd:bg-[#c0c2ce]"
                          key={key}
                        >
                          <td className="text-left px-5 py-1 font-semibold">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </td>{" "}
                          <td className="text-right px-5 py-1">{value}</td>
                        </tr>
                      ))}
                  </table>
                </Scrollbars>
              </div>
              <div className="w-full flex justify-center items-center">
                <Button
                  className="w-2/5 p-8 font-sans shadow-button text-xl text-white"
                  style={{ backgroundColor: selectedCar.color }}
                >
                  Rent
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
