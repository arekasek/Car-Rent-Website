"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 6000,
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Slider {...settings} className="w-full">
        {cars.map((car, index) => (
          <div
            key={index}
            className="slider-1 p-2 xs:p-4 sm:p-8 md:p-12 lg:p-[16rem] mb-20 relative"
            style={{
              backgroundImage: `url(${car.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {car.brand} {car.model}
            </h1>
          </div>
        ))}
      </Slider>
    </div>
  );
}
