if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const d=e=>i(e,o),c={module:{uri:o},exports:l,require:d};s[o]=Promise.all(n.map((e=>c[e]||d(e)))).then((e=>(r(...e),l)))}}define(["./workbox-4ee7f24a"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/decode-worker.5da45328.js",revision:null},{url:"assets/index.c7d26e38.js",revision:null},{url:"assets/index.d75a8e21.css",revision:null},{url:"assets/vendor.4d699ec1.js",revision:null},{url:"assets/vendor.8a0bb0d8.css",revision:null},{url:"assets/video-worker.2ba4a3fb.js",revision:null},{url:"index.html",revision:"6a9788cc7d49350d27b606e667192959"},{url:"favicon.svg",revision:"74b3b1e728e851ec4b19fd2bd21a3b19"},{url:"favicon.ico",revision:"79cf0342b0399650757c1421acdf467f"},{url:"apple-touch-icon.png",revision:"15982ae943bee0e37046d70678919e73"},{url:"android-chrome-192x192.png",revision:"136dd64fc598f2f7d11e11939bf7c001"},{url:"android-chrome-512x512.png",revision:"d21ebf94388b70179389b24e0953bc6e"},{url:"maskable_icon_x512.png",revision:"5c726d961b1adc5efb812ca32c237012"},{url:"manifest.webmanifest",revision:"25f4b844ed456905b7903f5497fbf50a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));