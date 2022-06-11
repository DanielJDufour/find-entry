const fs = require("fs");
const path = require("path");

function existsSync(path) {
  try {
    return fs.existsSync(path);
  } catch (err) {
    return false;
  }
}

// get package name from an absolute path to the project
function getPackageName(dirpath) {
  if (!path.isAbsolute(dirpath)) throw Error("[find-entry.getPackageName] dirpath must be absolute");

  try {
    const pkgpath = path.join(basepath, "package.json");
    if (existsSync(pkgpath)) {
      const package_name = JSON.parse(fs.readFileSync(pkgpath, "utf-8")).name;
      if (package_name) {
        if (debug) console.log("[find-entry] found name in package.json");
        return package_name;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const camelcase = str => str.replace(/([A-Za-z])[-|_]([A-Za-z])/g, (m, a, b) => a + b.toUpperCase());
const dashcase = str =>
  str
    .replace(/[-_]/g, "_")
    .replace(/([a-z])([A-Z])/, "$1-$2")
    .toLowerCase();
const snakecase = str =>
  str
    .replace(/-/g, "_")
    .replace(/([a-z])([A-Z])/, "$1_$2")
    .toLowerCase();
const smush = str => str.replace(/[-_]/g, "").toLowerCase();

const relative_paths = [
  "./src/index.ts",
  "./src/main.ts",
  "./lib/index.ts",
  "./lib/main.ts",
  "./src/index.js",
  "./src/main.js",
  "./lib/index.js",
  "./lib/main.js",

  "./index.ts",
  "./main.ts",
  "./app.ts",
  "./index.js",
  "./main.js",
  "./app.js",

  // typescript
  ({ package_name }) => `./src/${package_name}.ts`,
  ({ package_name }) => `./lib/${package_name}.ts`,
  ({ package_name }) => `./src/${dashcase(package_name)}.ts`,
  ({ package_name }) => `./lib/${dashcase(package_name)}.ts`,
  ({ package_name }) => `./src/${snakecase(package_name)}.ts`,
  ({ package_name }) => `./lib/${snakecase(package_name)}.ts`,
  ({ package_name }) => `./src/${camelcase(package_name)}.ts`,
  ({ package_name }) => `./lib/${camelcase(package_name)}.ts`,
  ({ package_name }) => `./src/${smush(package_name)}.ts`,
  ({ package_name }) => `./lib/${smush(package_name)}.ts`,

  // javascript
  ({ package_name }) => `./src/${package_name}.js`,
  ({ package_name }) => `./lib/${package_name}.js`,
  ({ package_name }) => `./src/${dashcase(package_name)}.js`,
  ({ package_name }) => `./lib/${dashcase(package_name)}.js`,
  ({ package_name }) => `./src/${snakecase(package_name)}.js`,
  ({ package_name }) => `./lib/${snakecase(package_name)}.js`,
  ({ package_name }) => `./src/${camelcase(package_name)}.js`,
  ({ package_name }) => `./lib/${camelcase(package_name)}.js`,
  ({ package_name }) => `./src/${smush(package_name)}.js`,
  ({ package_name }) => `./lib/${smush(package_name)}.js`,

  // typescript
  ({ package_name }) => `./${package_name}.ts`,
  ({ package_name }) => `./${dashcase(package_name)}.ts`,
  ({ package_name }) => `./${snakecase(package_name)}.ts`,
  ({ package_name }) => `./${camelcase(package_name)}.ts`,
  ({ package_name }) => `./${smush(package_name)}.ts`,

  // javascript
  ({ package_name }) => `./${package_name}.js`,
  ({ package_name }) => `./${dashcase(package_name)}.js`,
  ({ package_name }) => `./${snakecase(package_name)}.js`,
  ({ package_name }) => `./${camelcase(package_name)}.js`,
  ({ package_name }) => `./${smush(package_name)}.js`,
];

// const always_skip = [
//   /bak/,
//   /bundle/,
//   /dist/,
//   /\/\./, // hidden file or directory
//   /.min.[js|ts]$/,
//   /test\.(js|ts)$/
// ];

function findEntry(dirpath, { debug = false, package_name } = {}) {
  const basepath = (() => {
    if (dirpath && path.isAbsolute(dirpath)) {
      return dirpath;
    } else if (dirpath) {
      return path.join(process.cwd(), dirpath);
    } else {
      return process.cwd();
    }
  })();
  if (debug) console.log("[find-entry] starting search from ", basepath);

  // determine package.json
  if (!package_name) {
    package_name = (() => {
      const pkgpath = path.join(basepath, "package.json");
      if (existsSync(pkgpath)) {
        const package_name = JSON.parse(fs.readFileSync(pkgpath, "utf-8")).name;
        if (package_name) {
          if (debug) console.log("[find-entry] found name in package.json");
          return package_name;
        }
      }

      if (process.env.npm_package_name) {
        return process.env.npm_package_name;
      }

      return path.basename(path.dirname(basepath));
    })();
  }
  if (debug) console.log("[find-entry] using package name:", package_name);

  for (let i = 0; i < relative_paths.length; i++) {
    let relpath = relative_paths[i];
    if (typeof relpath === "function") relpath = relpath({ package_name });
    const abspath = path.join(basepath, relpath);
    if (debug) console.log("[find-entry] checking " + abspath);
    if (existsSync(abspath)) {
      if (debug) console.log("[find-entry] found entry at " + abspath);
      return abspath;
    }
  }
}

module.exports = findEntry;
module.exports.default = findEntry;
