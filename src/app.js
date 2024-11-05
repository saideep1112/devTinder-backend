const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the test");
});

app.use("/hello", (req, res) => {
  res.send("namaste dev from hello");
});

app.use((req, res) => {
  res.send("namaste dev");
});

app.listen(3000, () => {
  console.log("the server is listening on port 3000");
});
