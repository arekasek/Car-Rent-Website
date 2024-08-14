const express = require("express");
const cors = require("cors");
const { color } = require("framer-motion");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get("/api/cars", (req, res) => {
  res.json([
    {
      brand: "Mini",
      model: "Cooper",
      image: "https://i.postimg.cc/wMyY2bp2/mini.png",
      color: "#890616",
      imageFront: "/img/mini-front.png",
      data: {
        engine: "1.6L I-4 Engine",
        horsePower: "172 HP",
        chassis: "Hatchback",
        fuel: "benzine",
        transmission: "manual",
        drive: "FWD",
        doors: "3",
        seats: "5",
        year: "2015",
        description: "Sporty, agile, and stylish hatchback.",
      },
    },
    {
      brand: "Ford",
      model: "Fiesta",
      image: "https://i.postimg.cc/zvzMVtdp/mustang.png",
      color: "#0065B2",
      imageFront: "/img/fiesta-side.png",
      data: {
        engine: "1.6L L4 DOHC 16-valve",
        horsePower: "120 HP",
        chassis: "Sedan",
        fuel: "benzine",
        transmission: "automatic",
        drive: "FWD",
        doors: "5",
        seats: "5",
        year: "2012",
        description: "Compact, efficient, and fun-to-drive sedan",
      },
    },
    {
      brand: "Lamborghini",
      model: "Huracan",
      image: "https://i.postimg.cc/CM8ptXDT/lamborghini.png",
      color: "#5194D5",
      imageFront: "/img/huracan-side.png",
      data: {
        engine: "5.2L V10 Engine",
        horsePower: "602 HP",
        chassis: "Convertible",
        fuel: "gasoline",
        transmission: "automatic",
        drive: "AWD",
        doors: "2",
        seats: "2",
        year: "2016",
        description:
          "A luxurious and sporty convertible with a powerful V10 engine.",
      },
    },
    {
      brand: "Chevrolet",
      model: "Corvette",
      image: "https://i.postimg.cc/jS7sYWyd/corvette1.png",
      color: "#EFCE00",
      imageFront: "/img/corvette-side.png",
      data: {
        engine: "6.2L V8 Engine",
        horsePower: "495 HP",
        chassis: "Coupe",
        fuel: "gasoline",
        transmission: "automatic",
        drive: "RWD",
        doors: "2",
        seats: "2",
        year: "2017",
        description:
          "An iconic American sports car with a powerful V8 engine and advanced performance features.",
      },
    },
    {
      brand: "Ford",
      model: "Mustang",
      image: "https://i.postimg.cc/pdFsPvdH/mustang2.png",
      color: "#C99330",
      imageFront: "/img/mustang2-side.png",
      data: {
        engine: "5.4L V8 Engine",
        horsePower: "500 HP",
        chassis: "Coupe",
        fuel: "gasoline",
        transmission: "manual",
        drive: "RWD",
        doors: "2",
        seats: "2",
        year: "2005",
        description:
          "A high-performance sports car with a powerful V8 engine and distinctive Shelby styling.",
      },
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
