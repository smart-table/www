const fs = require('fs');
const path = require('path');
const readline = require('readline');

const iconDir = path.join(process.cwd(), '/src/assets/icons/SVG');
const icons = fs.readdirSync(iconDir);

for (let icon of icons) {
  const [name, extension] = icon.split('.');
  const writeStream = fs.createWriteStream(path.join(process.cwd(), '/src/views/svg/', `${name}.pug`));
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(iconDir, icon), {encoding: 'utf8'})
  });

  rl.on('line', (line) => {
    writeStream.write(`        ${line}
`);
  });

  writeStream.write(`mixin ${name}(icon)
    span(class=icon ? 'icon svg-container':'svg-container').
`);
}