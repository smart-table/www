const wb = require('workbox-build');

wb.generateSW({
  globDirectory: './dist/',
  globPatterns: ['**\/*.{html,js,css,svg}'],
  swDest: './dist/sw.js',
  // modifyUrlPrefix:{
  //   'assets': '.'
  // }
})
  .then(() => {
    console.log('Service worker generated.');
  });