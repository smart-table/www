const pug = require('pug');
const fs = require('fs');
const path = require('path');


const pages = fs.readdirSync(path.join(process.cwd(), '/src/views/pages'));
for (let page of pages) {
  const [name, extension] = page.split('.');
  const stream = fs.createWriteStream(path.join(process.cwd(), `/dist/${name}.html`));
  const html = pug.renderFile(path.join(process.cwd(), `/src/views/pages/${page}`));
  stream.write(html);
}