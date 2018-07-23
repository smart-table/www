/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "angular.html",
    "revision": "ffaf67e0ec1d0a01e05ec3d3bd52c960"
  },
  {
    "url": "assets/cuba.svg",
    "revision": "72cb307a9d7f4e1d44d32f426553a94e"
  },
  {
    "url": "assets/dataBundle.js",
    "revision": "6eb5c32959db84e4da7d57213bec533b"
  },
  {
    "url": "assets/dataBundle.min.js",
    "revision": "34d03042459c34869e20d55414b36acb"
  },
  {
    "url": "assets/demo.css",
    "revision": "eb9b8c2a1e79e23c4ba200bed5dab6ab"
  },
  {
    "url": "assets/demo.js",
    "revision": "27ff8b8d158319c720c8019f1ef91ec0"
  },
  {
    "url": "assets/demo.min.js",
    "revision": "bb3f46bb7ce60629e947a129582020e9"
  },
  {
    "url": "assets/logo.svg",
    "revision": "8c8a1507a8763ccd48108f1aa0db3eee"
  },
  {
    "url": "assets/prism-tomorrow.css",
    "revision": "ee446a32975a98ab3bc64dd9fa1425a1"
  },
  {
    "url": "assets/theme.css",
    "revision": "eb785607b770f75bcae1615e5d6d3365"
  },
  {
    "url": "demo.html",
    "revision": "ff8c95cb92e36f4aab471503c24ea73f"
  },
  {
    "url": "extend.html",
    "revision": "b1194a9cb226b27f13f5b1c6123e5121"
  },
  {
    "url": "filter.html",
    "revision": "95c9ebd8503ed200421a421272929c7e"
  },
  {
    "url": "flaco.html",
    "revision": "fbd21b217274ebefa842f5d2afec92a8"
  },
  {
    "url": "getting-started.html",
    "revision": "82fbaddae6441aa4a6766793d9eac62b"
  },
  {
    "url": "index.html",
    "revision": "6542814c158d38e6007c96db6a14813d"
  },
  {
    "url": "preact.html",
    "revision": "87304ec9f4a90eb53f7d1238f2c6b470"
  },
  {
    "url": "react.html",
    "revision": "e4bef34c1260e052ae9283842bf67845"
  },
  {
    "url": "search.html",
    "revision": "f64ec7c67d8f207bad34fc9c6cb5db27"
  },
  {
    "url": "slice.html",
    "revision": "6a8710f17c5926b5d212323bbe985bc5"
  },
  {
    "url": "sort.html",
    "revision": "f870b5ff426afc829fa22a68d127f956"
  },
  {
    "url": "summary.html",
    "revision": "5f9b149c01cd551c7e4ee46b6d4515ed"
  },
  {
    "url": "table-state.html",
    "revision": "631f1eb3624168d33c73134b760959f9"
  },
  {
    "url": "table.html",
    "revision": "5dfe0acb780adc95011d545819812eb1"
  },
  {
    "url": "vanilla.html",
    "revision": "a9afcc0e345cb295b2e465cfd76029d7"
  },
  {
    "url": "vuejs.html",
    "revision": "ed7a79e21e9e76a910180a2eb1ef1a29"
  },
  {
    "url": "working-indicator.html",
    "revision": "6cf62b11b3c872d65dc2e9a99e5b5ca8"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
