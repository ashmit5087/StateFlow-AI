const fs = require("fs");
const path = require("path");

const root = __dirname ? path.resolve(__dirname, "..") : process.cwd();
const files = [
  path.join(
    root,
    "node_modules",
    ".pnpm",
    "d3-drag@3.0.0",
    "node_modules",
    "d3-drag",
    "src",
    "constant.js",
  ),
  path.join(
    root,
    "node_modules",
    ".pnpm",
    "d3-zoom@3.0.0",
    "node_modules",
    "d3-zoom",
    "src",
    "constant.js",
  ),
];

const source = [
  "export default function(x) {",
  "  return function() {",
  "    return x;",
  "  };",
  "}",
  "",
].join("\n");

for (const file of files) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    continue;
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, source, "utf8");
  }
}
