const test = require("flug");
const findEntry = require("./find-entry.js");

test("no params", ({ eq }) => {
  const entry_path = findEntry();
  eq(entry_path.startsWith("/"), true);
  eq(entry_path.endsWith("/find-entry/find-entry.js"), true);
});

test("src/index.js", ({ eq }) => {
  const entry_path = findEntry("../../GeoTIFF/geoblaze");
  eq(entry_path.startsWith("/"), true);
  eq(entry_path.endsWith("/geoblaze/src/index.js"), true);
});

test("georaster-layer-for-leaflet", ({ eq }) => {
  const entry_path = findEntry("../../GeoTIFF/georaster-layer-for-leaflet", { debug: false });
  eq(entry_path.startsWith("/"), true);
  eq(entry_path.endsWith("/georaster-layer-for-leaflet/src/georaster-layer-for-leaflet.ts"), true);
});

test("parse-any-int", ({ eq }) => {
  const entry_path = findEntry("../parse-any-int", { debug: false });
  eq(entry_path.startsWith("/"), true);
  eq(entry_path.endsWith("/parse-any-int.js"), true);
});
