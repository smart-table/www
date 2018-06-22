const wb = require('workbox-build');

wb.generateSW({
  globDirectory: './docs/',
  globPatterns: ['**\/*.{html,js,css,svg}'],
  swDest: './docs/sw.js',
  // modifyUrlPrefix:{
  //   'assets': '.'
  // }
})
  .then(() => {
    console.log('Service worker generated.');
  });