const express = require("./express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.end("home page");
});
app.get("/about", (req, res) => {
  res.end("about page");
});

app.use("/public", express.static(path.resolve(__dirname, "/public")));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
