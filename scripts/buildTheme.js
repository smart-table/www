const postcss = require('postcss');
const next = require('postcss-cssnext');
const fs = require('fs');
const path = require('path');
const nano = require('cssnano');

const sourcePath = path.resolve(process.cwd(), './src/css/theme.css');
const destPath = path.resolve(process.cwd(), './src/assets/theme.css');

fs.readFile(sourcePath, function (err, css) {
  postcss([next(), nano()])
    .process(css, {from: sourcePath, to: destPath})
    .then(function (result) {
      fs.writeFileSync(destPath, result.css);
    });
});
