const es2015 = require("babel-preset-es2015");
const presetReact = require("babel-preset-react");
require("babel-register")({
  presets: [es2015, presetReact],
});

const router = require("./routes.tsx").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
  return (
    new Sitemap(router())
      .build("https://covid19ph-tracker.herokuapp.com")
      .save("build/sitemap.xml")
  );
}

generateSitemap();
