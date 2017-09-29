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
    "revision": "2e90ba9afaa2f2925ea9a16e91507655"
  },
  {
    "url": "extend.html",
    "revision": "8ccc031e44da8925ea1f7c61471e8793"
  },
  {
    "url": "filter.html",
    "revision": "5a88ca6cf640c59290e5202e01f200bb"
  },
  {
    "url": "flaco.html",
    "revision": "5d541b7752164001db4843c72f1479d1"
  },
  {
    "url": "getting-started.html",
    "revision": "9603cc0d3762f71eb17dad1e4777390f"
  },
  {
    "url": "index.html",
    "revision": "b250e01a24e52f7fe8bc6e8af434b366"
  },
  {
    "url": "preact.html",
    "revision": "1b3fe6f61d4a0165935d31ffb89eef5e"
  },
  {
    "url": "react.html",
    "revision": "1b50bb887a815039ad818c6e3e54fbf4"
  },
  {
    "url": "search.html",
    "revision": "db865499dfe657579ddf9e9b48b532ee"
  },
  {
    "url": "slice.html",
    "revision": "ca176aef104e9452a63ecc7d4ac03fc2"
  },
  {
    "url": "sort.html",
    "revision": "5a5d0a22757b9c58bdbe957f557b8080"
  },
  {
    "url": "summary.html",
    "revision": "970e26738fd2c1d75d244ab5a070f089"
  },
  {
    "url": "table-state.html",
    "revision": "18562858ca604ab6c9abc03162308d29"
  },
  {
    "url": "table.html",
    "revision": "093f75d47f841a8b9b9b792f0c66a557"
  },
  {
    "url": "vanilla.html",
    "revision": "c10475409d739d6d6406d8340b289dae"
  },
  {
    "url": "vuejs.html",
    "revision": "dcc7a56895ff2b35d38533f741558fef"
  },
  {
    "url": "working-indicator.html",
    "revision": "736e9f99707748b536d26b81e4778a2a"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
