const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "build");

app.use(express.static(publicPath));
app.use((req, res, next) => {
  if (req.get('X-Forwarded-Proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
