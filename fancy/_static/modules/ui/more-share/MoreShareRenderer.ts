// import { MoreshareRenderData, PseudoTriggeredEvent } from "ftypes";

export {}; // for TS2669

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
import("./Action").then(({ setup }) => {
    setup();
});
// }
