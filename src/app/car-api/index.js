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
        fuel: "benzine",
        transmission: "manual",
        doors: "3",
        seats: "5",
        description: "nice car",
        year: "2015",
      },
    },
    {
      brand: "Ford",
      model: "Fiesta",
      image: "https://i.postimg.cc/zvzMVtdp/mustang.png",
      color: "#0065B2",
    },
    {
      brand: "Lamborghini",
      model: "Huracan",
      image: "https://i.postimg.cc/CM8ptXDT/lamborghini.png",
      color: "#5194D5",
    },
    {
      brand: "Chevrolet",
      model: "Corvette",
      image: "https://i.postimg.cc/jS7sYWyd/corvette1.png",
      color: "#EFCE00",
    },
    {
      brand: "Ford",
      model: "Mustang",
      image: "https://i.postimg.cc/pdFsPvdH/mustang2.png",
      color: "#C99330",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
