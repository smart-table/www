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
    "revision": "8624bdeecf6f107e50c22ec72facf548"
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
    "revision": "b984124313ac46bb67307284ae39f855"
  },
  {
    "url": "filter.html",
    "revision": "25409db123fed611cd2f548cbb32a768"
  },
  {
    "url": "flaco.html",
    "revision": "fbd21b217274ebefa842f5d2afec92a8"
  },
  {
    "url": "getting-started.html",
    "revision": "656cee273186c8c6940c0d04976b3c2f"
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
    "revision": "cdd26e2433e257f732e480ebf7bebd39"
  },
  {
    "url": "search.html",
    "revision": "bd30625bde7a682bba4ac91628ee8b07"
  },
  {
    "url": "slice.html",
    "revision": "b3a81ddb8744462dee8088a4db588336"
  },
  {
    "url": "sort.html",
    "revision": "0353cf7b55720a37eaaba39ec13527ed"
  },
  {
    "url": "summary.html",
    "revision": "c1f769f324c8e4e9577a2a933189c9a5"
  },
  {
    "url": "table-state.html",
    "revision": "3a3e010667416266a5ea25ed291e5500"
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
    "revision": "05d6eb6286652a0a9a445f10793bdaa7"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
