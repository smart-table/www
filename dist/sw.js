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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
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
    "revision": "68fe6c276c453eeee4c58670fb761379"
  },
  {
    "url": "extend.html",
    "revision": "b7b2d3656353663f8c79b240b245e6d2"
  },
  {
    "url": "filter.html",
    "revision": "4527f61998359726a36cd964df735b3e"
  },
  {
    "url": "flaco.html",
    "revision": "8b274756844bf7507f75ec7058e8df07"
  },
  {
    "url": "getting-started.html",
    "revision": "562c95e019fdfff4d61bcf244ef0768c"
  },
  {
    "url": "index.html",
    "revision": "cee4777ed37f80ce418376819b7445a4"
  },
  {
    "url": "preact.html",
    "revision": "f273ff5ccc31a2bc19d7d15cf58b9183"
  },
  {
    "url": "react.html",
    "revision": "e481d20db080b5641581bb6d3c6e6ba9"
  },
  {
    "url": "search.html",
    "revision": "6bef6470bb7efb65d0d7bc64388e6528"
  },
  {
    "url": "slice.html",
    "revision": "b9d85e0500feb90d2c35e0afcdcbb7f1"
  },
  {
    "url": "sort.html",
    "revision": "935f8eb65d5cea3f4d274ad8fa2326ff"
  },
  {
    "url": "summary.html",
    "revision": "4fa9842a9fe30b2fe1e573dd9409c0cf"
  },
  {
    "url": "table-state.html",
    "revision": "cfcde2f1d44ec0e72005ea93c631fd9e"
  },
  {
    "url": "table.html",
    "revision": "c4a8c2c0b595869ae07c42804c18a0f6"
  },
  {
    "url": "vanilla.html",
    "revision": "78ea02b5e8801c612f606852a7a8bd4f"
  },
  {
    "url": "vuejs.html",
    "revision": "6adf12236e0bfa83c4b4475a462b5112"
  },
  {
    "url": "working-indicator.html",
    "revision": "03fc180eee68bcbd559da12853cd8692"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
