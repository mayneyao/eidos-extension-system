/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    // if request pathname is /sw.js, return the service worker
    if (request.url.endsWith("/sw.js")) {
      const swjsContent = `self.addEventListener('install', function(event) {
              console.log('Service worker installing...');
              // Add a call to skipWaiting here
              self.skipWaiting();
          });
          self.addEventListener('activate', function(event) {
              console.log('Service worker activating...');
          });
  
  
          function loadExtAsset(url) {
              const msgChannel = new MessageChannel();
              return self.clients.matchAll().then(cls=>{
                  console.log("cls", cls);
                  cls[0].postMessage({
                      type: "loadExtensionAsset",
                      url: url
                  }, [msgChannel.port2]);
                  return new Promise((resolve) => {
                      msgChannel.port1.onmessage = function(event) {
                          console.log('get asset from main', event)
                          if (event.data.type == "loadExtensionAssetResp") {
                              msgChannel.port1.close();
                              resolve(
                                  new Response(event.data.text, {
                                      headers: {
                                          "content-type": event.data.contentType,
                                          "Cross-Origin-Resource-Policy": "cross-origin",
                                          "Cross-Origin-Embedder-Policy": "require-corp",
                                          "Cross-Origin-Opener-Policy": "same-origin",
                                      },
                                  })
                              );
                              
                          }
                      };
                  })
              })
              
          }
          self.addEventListener('fetch', function(event) {
              if (!event.request.url.endsWith("/")) {
                  event.respondWith(loadExtAsset(event.request.url));
              }
          });
          `;
      return new Response(swjsContent, {
        headers: {
          "content-type": "application/javascript;charset=UTF-8",
        },
      });
    }
    const html = `<!DOCTYPE html>
        <head>
          <script type="module">
              const msgChannel = new MessageChannel();
              const extensionId = window.location.hostname.split(".")[0];
              window.parent.postMessage({
                  type: "loadExtension",
                  name: extensionId,
              }, "*", [msgChannel.port2]);
              msgChannel.port1.onmessage = function(event) {
                  if (event.data.type == "loadExtensionResp") {
                      // replace html with the content from extension
                      document.body.innerHTML = event.data.text;
                      // find all script tags and load them
                      const scripts = document.querySelectorAll("body>script");
                      scripts.forEach((script) => {
                          const newScript = document.createElement("script");
                          newScript.src = script.src;
                          document.body.appendChild(newScript);
                      });
                      msgChannel.port1.close();
                  }
              };
              navigator.serviceWorker.onmessage = async (swEvent) => {
                  console.log("swEvent", swEvent);
                  if (swEvent.data.type == "loadExtensionAsset") {
                      // load asset from extension
                      const msgChannel = new MessageChannel();
                      window.parent.postMessage({
                          type: "loadExtensionAsset",
                          url: event.data.url,
                      }, "*", [msgChannel.port2]);
  
                      msgChannel.port1.onmessage = function(event) {
                          console.log('get asset from eidos', event)
                          if (event.data.type == "loadExtensionAssetResp") {
                              console.log("swEvent.ports", swEvent.ports);
                              swEvent.ports[0].postMessage({
                                  type: "loadExtensionAssetResp",
                                  text: event.data.text,
                                  contentType: event.data.contentType,
                              });
                              msgChannel.port1.close();
                          }
                      };
                  }
              };
              // register sw.js
              if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').then(function(registration) {
                          // Registration was successful
                          console.log('ServiceWorker registration successful with scope: ', registration.scope);
                      }, function(err) {
                          // registration failed :(
                          console.log('ServiceWorker registration failed: ', err);
                      });
                  });
              }            
          </script>
        </head>
            <body>
              <h1>Eidos Extension Loading</h1>
            </body>`;
    return new Response(html, {
      headers: {
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
