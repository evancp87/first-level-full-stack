const axios = require("axios");
const express = require("express");
const app = express();
require("dotenv").config();
const apiKey = process.env.API_KEY;

const gamesRouter = require("./routes/games");

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(function myLogger(req, res, next) {
  console.log("logged");
  next();
});

// app.use((req, res, next) => {
//   req.wishlists = wishlists;

//   next();
// });

// app.use((req, res, next) => {

//   req.games = games;

//   next();
// });

app.use(async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${apiKey}`
    );
    req.games = data.results;
    next();
  } catch (error) {
    console.error("Error fetching games data:", error);
    res.sendStatus(500);
  }
});

app.use("/", gamesRouter);

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// https://github.com/jmsherry/file_upload_demo
