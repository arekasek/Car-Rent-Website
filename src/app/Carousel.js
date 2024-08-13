"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./fonts/menu-font.css";
import "./fonts/thunder-font.css";
import "./fonts/vibes-font.css";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Carousel() {
  const [cars, setCars] = useState([]);

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

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="relative w-full h-[75vh]">
        <Slider {...settings} className="w-full h-full ">
          {cars.map((car, index) => (
            <div
              key={index}
              className={` w-full h-[75vh] relative ${car.model.toLowerCase()}`}
            >
              <h1 className="top-[calc(50%-20px)] 2xl:top-[calc(50%-120px)] xl:top-[calc(50%-80px)] lg:top-[calc(50%-60px)] md:top-[calc(50%-40px)] sm:top-[calc(50%-20px)] 2xl:text-[15vw] xl:text-[15rem] lg:text-[12rem] md:text-[10rem] sm:text-[8rem] text-[20vw] scale-x-125 scale-y-[1.5] opacity-40 text-[#000000] absolute thunder  left-1/2 transform -translate-y-1/2 -translate-x-1/2 -z-10 text-wrap text-center">
                {car.model.toUpperCase()}
              </h1>

              <h1 className=" text-[#4d4d4d] absolute vibes top-[25%] 2xl:top-[2%] xl:top-[8%] lg:top-[10%] md:top-[15%] sm:top-[20%]   left-1/2 transform -translate-x-1/2 vibes -z-10 text-wrap text-center 2xl:text-[5vw] xl:text-[8vw] lg:text-[5vw] md:text-[7vw] sm:text-[5vw] text-[15vw]">
                {car.brand}
              </h1>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
