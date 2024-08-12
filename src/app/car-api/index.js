const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());

app.get("/api/cars", (req, res) => {
  res.json([
    {
      brand: "Ford",
      model: "Mustang",
      image: "https://i.postimg.cc/m2ybJhb3/mustang.png",
    },
    {
      brand: "Lamborghini",
      model: "Huracan",
      image: "https://i.postimg.cc/rmtqN0SS/lamborghini.png",
    },
    {
      brand: "Chevrolet",
      model: "Camaro",
      image: "https://example.com/chevrolet-camaro.png",
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
