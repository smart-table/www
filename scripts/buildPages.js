const pug = require('pug');
const fs = require('fs');
const path = require('path');
const prism = require('prismjs');
const codeRoot = path.join(process.cwd(), './src/views/code/');
const opts = require('./pagesOptions');

const highlighter = {
  loadContent(file){
    return fs.readFileSync(path.join(this.root, file));
  },
};

function prismHighlighter (language, root) {
  const instance = {
    highlight(file){
      const content = this.loadContent(file);
      return this.prism.highlight(content.toString(), this.prism.languages[language]);
    }
  };
  Object.defineProperty(instance, 'root', {value: root});
  return instance;
}

const cssHighlighter = function (prism, root) {
  return Object.create(Object.assign(prismHighlighter('css', root), highlighter), {prism: {value: prism}});
};

const jsHighlighter = function (prism, root) {
  return Object.create(Object.assign(prismHighlighter('javascript', root), highlighter), {prism: {value: prism}});
};

const markupHighlighter = function (prism, root) {
  const instance = Object.create(Object.assign(prismHighlighter('markup', root), highlighter), {prism: {value: prism}});

  const load = instance.loadContent.bind(instance);
  instance.loadContent = function (file) {
    return pug.render(load(file), {pretty: true});
  };
  return instance;
};

function highlight (root) {
  return function (fileName) {
    const [fn, extension] = fileName.split('.');
    switch (extension) {
      case 'css':
        return cssHighlighter(prism, root).highlight(fileName);
      case 'js':
        return jsHighlighter(prism, root).highlight(fileName);
      case 'pug':
        return markupHighlighter(prism, root).highlight(fileName);
      default:
        throw new Error('unsupported language');
    }
  }
}


const pages = fs.readdirSync(path.join(process.cwd(), '/src/views/pages'));
for (let page of pages) {
  const [name, extension] = page.split('.');
  const stream = fs.createWriteStream(path.join(process.cwd(), `/dist/${name}.html`));
  const html = pug.renderFile(path.join(process.cwd(), `/src/views/pages/${page}`), Object.assign({highlight: highlight(codeRoot)}, opts[name] || {}));
  stream.write(html);
}