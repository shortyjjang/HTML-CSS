import React from "react";
import ReactDOM from "react-dom";

// render without using JSX
export function jsRender(Component: React.ComponentClass<{}, any>, data = {}, targetElement: Element, callback = () => {}) {
    const rEl = React.createElement(Component, data);
    return ReactDOM.render(rEl, targetElement, callback);
}

// Render to specific element position with a wrap.
// function wrappedRenderCreator(
//     $WrapperMethodKey/* appendTo, prependTo, insertAfter, insertBefore, ... */,
//     Component,
//     data,
//     targetElement,
//     wrapElementTag='div',
//     callback
// ) {
//     let wrapper = $(`<${wrapElementTag} />`)[$WrapperMethodKey](targetElement).get(0);
//     return function renderAfter() {
//         return jsRender(Component, data, wrapper, callback);
//     };
// }

function Prepend(rctElDomRef: Element, targetElement: Element) {
    $(rctElDomRef).prependTo(targetElement);
}
function Append(rctElDomRef: Element, targetElement: Element) {
    $(rctElDomRef).appendTo(targetElement);
}
function After(rctElDomRef: Element, targetElement: Element) {
    $(rctElDomRef).insertAfter(targetElement);
}
function Before(rctElDomRef: Element, targetElement: Element) {
    $(rctElDomRef).insertBefore(targetElement);
}
function Replace(rctElDomRef: Element, targetElement: Element) {
    $(targetElement).replaceWith(rctElDomRef);
}

export const RenderModes = {
    Prepend,
    Append,
    After,
    Before,
    Replace
};

type RenderModeMethods = typeof Prepend | typeof Append | typeof After | typeof Before | typeof Replace;

const FACTORY_DIV_ID = "__external_render_factory__";
// Warning: this works until React 16, and it could get broken at some point.
export function externalRender(
    mode: RenderModeMethods,
    Component: React.ComponentClass,
    data: Object,
    targetElement: Element,
    callback?: Function
) {
    const FACTORY_DIV_REF = document.createElement("div");
    FACTORY_DIV_REF.id = FACTORY_DIV_ID;
    document.body.appendChild(FACTORY_DIV_REF);
    const rctElRef = jsRender(Component, data, FACTORY_DIV_REF);
    let rctElDomRef;
    if (rctElRef) {
        // non-stateless component
        rctElDomRef = ReactDOM.findDOMNode(rctElRef);
    } else {
        // Stateless component
        const cs = FACTORY_DIV_REF.children;
        if (cs.length === 0) {
            console.warn("externalRender: There might be a chance element is not rendered.");
        }
        rctElDomRef = cs[0];
    }

    if (rctElDomRef && rctElDomRef instanceof Element) {
        mode(rctElDomRef, targetElement);
        if (callback) {
            callback([rctElRef, rctElDomRef]);
        }

        FACTORY_DIV_REF.remove(); // Due to restriction, need to remove
        return [rctElRef, rctElDomRef];
    }
}

/*
// TEST
const ASDF = ({foo}) => <div className="asdfasdfasdfasdfasadsfdasfasdfdasf">{foo}</div>
class ASDF2 extends React.Component {
    render() {
        return <div className="213480123794578902349870239804129830">{this.props.foo}</div>
    }
}
externalRender(RenderModes.Prepend, ASDF, {foo: 1}, document.body);
externalRender(RenderModes.Prepend, ASDF2, {foo: 'heydsaasdfasdfldasflasdflfdaslkfsdakmdsaf'}, document.body);
*/

export function mountToDisposable(unmountedDOM: Element) {
    // Create/Select disposable mounting DIV to correctly modify a element.
    let $disposable = $(document.body).find(".disposable");
    if ($disposable.length > 0) {
        $disposable = $disposable.eq(0).empty();
    } else {
        $disposable = $("<div />", { id: "disposable", style: "display:none;" }).appendTo(document.body);
    }

    if (unmountedDOM) {
        // Append unmounted DOM if exists
        $disposable.append(unmountedDOM);
    }
    // return disposable DOM
    return $disposable;
}
