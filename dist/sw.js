importScripts('workbox-sw.prod.v2.0.3.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
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
    "revision": "8d197a1669613108ed55c1a494e6622a"
  },
  {
    "url": "assets/demo.css",
    "revision": "eb9b8c2a1e79e23c4ba200bed5dab6ab"
  },
  {
    "url": "assets/demo.js",
    "revision": "e2deec6282d5364a4149fb8080687d2f"
  },
  {
    "url": "assets/demo.min.js",
    "revision": "8fd5008ad148178c930a369366b0d065"
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
    "revision": "598913b3f838cd7a0e43772c4f4b069e"
  },
  {
    "url": "demo.html",
    "revision": "b88e427ef0c3694c8923044f6d0de4dc"
  },
  {
    "url": "extend.html",
    "revision": "589919e849b01a45250466bfea271e7d"
  },
  {
    "url": "filter.html",
    "revision": "f5361dd550bed6801d8fa3b7b86820da"
  },
  {
    "url": "flaco.html",
    "revision": "9ed45fd6343e75788340a78cbe4cfa05"
  },
  {
    "url": "getting-started.html",
    "revision": "f5ec09a4b1aa591ae030691a61dd8455"
  },
  {
    "url": "index.html",
    "revision": "7e4582425e055dafe14c466d956588c2"
  },
  {
    "url": "preact.html",
    "revision": "8c56c780bb3dc58203cadddb1c78754c"
  },
  {
    "url": "react.html",
    "revision": "8cc0d1e0178dc3d5e36b111ab7d6d232"
  },
  {
    "url": "search.html",
    "revision": "cfc50c2d64d515567e44f22a1ca5178d"
  },
  {
    "url": "slice.html",
    "revision": "571bcd89750f6d28e4be8bc119e4ae02"
  },
  {
    "url": "sort.html",
    "revision": "50dc950822eb9c5fa35faed414cb8682"
  },
  {
    "url": "summary.html",
    "revision": "ee99fdefc6bcf9a1a3be2ced22043642"
  },
  {
    "url": "table-state.html",
    "revision": "ce840773d04c5ce56650d30dcef995ea"
  },
  {
    "url": "table.html",
    "revision": "0b4d7eab0cd283a95e0a72ef932e6365"
  },
  {
    "url": "vanilla.html",
    "revision": "e3def4d5a12b463447de870993f6e960"
  },
  {
    "url": "vuejs.html",
    "revision": "7c871380b0a175718ca4860c8116c874"
  },
  {
    "url": "working-indicator.html",
    "revision": "8e97360dd3a29777cf7e1441ed37fe33"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
