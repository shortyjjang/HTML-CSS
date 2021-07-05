/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./_static/modules/ui/more-share/MoreShareRenderer.ts":
/*!************************************************************!*\
  !*** ./_static/modules/ui/more-share/MoreShareRenderer.ts ***!
  \************************************************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.e, __webpack_require__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// import { MoreshareRenderData, PseudoTriggeredEvent } from "ftypes";
 // for TS2669
// if (!__Config.design_v4) {
//     // Render utils
//     function extractDataFromLegacyElement(el: Element) {
//         const $el = $(el);
//         const obj: MoreshareRenderData = {
//             loggedIn: $el.attr("data-logged-in") != null,
//             title: $el.attr("data-title"),
//             viewerUsername: $el.attr("data-uname"),
//             objectId: $el.attr("data-object-id"),
//             objectType: $el.attr("data-object-type"),
//             showShortcuts: true,
//         };
//         if (!obj.objectType) {
//             console.warn("objectType missing.");
//         }
//         if (!obj.objectId) {
//             console.warn("objectId missing.");
//         }
//         const objectMeta = $el.attr("data-object-meta");
//         if (objectMeta) {
//             try {
//                 obj.objectMeta = JSON.parse(objectMeta); // JSON string
//             } catch (e) {
//                 obj.objectMeta = objectMeta;
//                 console.warn(e);
//             }
//         }
//         return obj;
//     }
//     function renderToStream(element: Element, callback: (rendered: Element) => void, additionalOptions = {}) {
//         Promise.all([
//             import("react-dom"),
//             import(/* webpackChunkName: "libf" */ "dom-helper"),
//             import(/* webpackChunkName: "libf" */ "common-components"),
//             import(/* webpackChunkName: "libf" */ "fancyutils"),
//         ]).then(([ReactDOM, { RenderModes, externalRender }, { MoreShare }, { loadCss }]) => {
//             loadCss("MoreShare");
//             const options = extractDataFromLegacyElement(element);
//             // Update parent <li /> element to 'active' when any menu is opened.
//             options.onShowSomething = (showingSomething: boolean, componentInstance: React.ReactInstance) => {
//                 const el = ReactDOM.default.findDOMNode(componentInstance);
//                 if (el) {
//                     const $li = $(el).closest(".stream li");
//                     if ($li.length > 0) {
//                         if (showingSomething === true) {
//                             $li.addClass("active");
//                         } else {
//                             $li.removeClass("active");
//                         }
//                     }
//                 }
//             };
//             window._.extend(options, additionalOptions);
//             return externalRender(RenderModes.Replace, MoreShare, options, element, (rendered: Element) => {
//                 callback(rendered);
//             });
//         });
//     }
//     function renderToButton(element: Element, callback: (rendered: Element) => void, additionalOptions = {}) {
//         const options = extractDataFromLegacyElement(element);
//         window._.extend(options, additionalOptions);
//         Promise.all([
//             import(/* webpackChunkName: "libf" */ "dom-helper"),
//             import(/* webpackChunkName: "libf" */ "common-components"),
//             import(/* webpackChunkName: "libf" */ "fancyutils"),
//         ]).then(([{ RenderModes, externalRender }, { MoreShare }, { loadCss }]) => {
//             loadCss("MoreShare");
//             return externalRender(RenderModes.Replace, MoreShare, options, element, (rendered: Element) => {
//                 callback(rendered);
//             });
//         });
//     }
//     // /templates/fancy4_0/shop/seller/_summary.html
//     // /templates/fancy4_0/user/_summary.v2.html
//     // /templates/fancy4_0/user/list.html
//     // renders stream type of things
//     function renderMoreShareGlobal({
//         containerSelector = ".stream",
//         componentClass = "menu-container",
//         btnClass = "btn-more",
//         renderMode = "Stream", // { 'Stream' | 'Button' }
//     } = {}) {
//         let $container;
//         if (containerSelector) {
//             $container = $(containerSelector);
//         } else {
//             $container = $(document.body);
//         }
//         let renderer: Function;
//         if (renderMode === "Stream") {
//             renderer = renderToStream;
//         } else if (renderMode === "Button") {
//             renderer = renderToButton;
//         } else {
//             console.warn("Unknown render mode");
//             return;
//         }
//         function handler(event: JQuery.TriggeredEvent | PseudoTriggeredEvent) {
//             if (document.readyState === "loading") {
//                 return;
//             }
//             const $replacingEl = $(event.currentTarget).closest(`.${componentClass}`);
//             if (!$replacingEl.attr("data-rendered")) {
//                 const $pairPoint = $replacingEl.parent();
//                 renderer(
//                     $replacingEl.get(0),
//                     () => {
//                         $pairPoint.find(`.${btnClass}`).get(0).click(); // deferred click-to-render for future appended elements.
//                     },
//                     { componentClass, btnClass }
//                 );
//             }
//         }
//         const eventElementSelector = `.${componentClass} .${btnClass}`;
//         if (renderMode === "Stream") {
//             $container.on("click", eventElementSelector, handler);
//         } else {
//             handler({ currentTarget: document.querySelector(eventElementSelector) });
//         }
//     }
//     window.renderMoreShare = renderMoreShareGlobal;
//     $(() => {
//         if (typeof window.initMoreShareOn === "string") {
//             renderMoreShareGlobal({ containerSelector: window.initMoreShareOn });
//             window.initMoreShareOn = undefined;
//         }
//     });
// } else {

Promise.all(/*! import() */[__webpack_require__.e("vendors"), __webpack_require__.e("libfancy"), __webpack_require__.e("_static_modules_ui_more-share_Action_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./Action */ "./_static/modules/ui/more-share/Action.tsx")).then(function (_ref) {
  var setup = _ref.setup;
  setup();
}); // }

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + {"vendors":"5c3fe075997d0cedc3a7","libfancy":"d9af77f7fca0bcbf243f","_static_modules_ui_more-share_Action_tsx":"46354aedc6520501a332"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fancy:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => fn(event));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/_static/_ui/js/bundle/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"MoreShare.entrypoint": 0
/******/ 		};
/******/ 		
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => {
/******/ 								installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 							});
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no deferred startup
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfancy"] = self["webpackChunkfancy"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./_static/modules/ui/more-share/MoreShareRenderer.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=MoreShare.entrypoint.5223eb693523cf9e8afd.js.map