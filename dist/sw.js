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
    "revision": "8c1b07d3525de5bbbdb40e8797652abb"
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
    "revision": "24c62ca721cf133b3d2f2be59df58473"
  },
  {
    "url": "extend.html",
    "revision": "5e55f5c3b8ab7d67e139e2268dd21e74"
  },
  {
    "url": "filter.html",
    "revision": "14b3e5c3a74dccc40918173a38df51df"
  },
  {
    "url": "flaco.html",
    "revision": "34eb77c37ae6ab3f92d9d520a6cf94c9"
  },
  {
    "url": "getting-started.html",
    "revision": "791407bf849df900625fee0c0c69842f"
  },
  {
    "url": "index.html",
    "revision": "76dd7846d71bae54fcb0187dad8c3d4a"
  },
  {
    "url": "preact.html",
    "revision": "660336490653006ba6193c2144c4e775"
  },
  {
    "url": "react.html",
    "revision": "80e7cf793a9199f0facbf3208eff4d2f"
  },
  {
    "url": "search.html",
    "revision": "14795b817e287e1103cd308df5262e63"
  },
  {
    "url": "slice.html",
    "revision": "e77c6fa7082de90a0476f3fb2a00371e"
  },
  {
    "url": "sort.html",
    "revision": "fe9272fc831e2413954b9cb6eb6d241f"
  },
  {
    "url": "summary.html",
    "revision": "64b37e2fbbfc77e917d7b362c48c79bf"
  },
  {
    "url": "table-state.html",
    "revision": "a5d84115708150195f2fa1e3f6e87c31"
  },
  {
    "url": "table.html",
    "revision": "aa5427be4097bc14f4d6274ce5d2fe1e"
  },
  {
    "url": "vanilla.html",
    "revision": "ac57176ae9ce3bc74813d0dd33bc59e3"
  },
  {
    "url": "vuejs.html",
    "revision": "0590386fe9ad9814ae50e4d18496c80f"
  },
  {
    "url": "working-indicator.html",
    "revision": "615025fab4167ef947ba274bdabc9a82"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
