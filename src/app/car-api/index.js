const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/cars", (req, res) => {
  res.json([
    {
      brand: "Mini",
      model: "Cooper",
      image: "https://i.postimg.cc/wMyY2bp2/mini.png",
    },
    {
      brand: "Ford",
      model: "Fiesta",
      image: "https://i.postimg.cc/zvzMVtdp/mustang.png",
    },
    {
      brand: "Lamborghini",
      model: "Huracan",
      image: "https://i.postimg.cc/CM8ptXDT/lamborghini.png",
    },
    {
      brand: "Chevrolet",
      model: "Corvette",
      image: "https://i.postimg.cc/jS7sYWyd/corvette1.png",
    },
    {
      brand: "Ford",
      model: "Mustang",
      image: "https://i.postimg.cc/pdFsPvdH/mustang2.png",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
